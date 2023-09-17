import { Component, OnInit, ViewChild, HostListener } from '@angular/core';
import { DatePipe } from '@angular/common';

import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import {
    MatTableDataSource,
    MatTableDataSourcePaginator,
} from '@angular/material/table';
import * as pdfMake from 'pdfmake/build/pdfmake';
import * as pdfFonts from 'pdfmake/build/vfs_fonts';
import {
    trigger,
    state,
    style,
    transition,
    animate,
} from '@angular/animations';
pdfMake.vfs = pdfFonts.pdfMake.vfs;
import { orderBy } from 'natural-orderby';

import { Store } from '../models/store';
import { Visit } from '../models/visit';
import { Patient } from '../models/patient';
import { Company } from '../models/company';
import { StoreService } from '../services/store.service';
import { SnackService, SNACK_TYPE } from '../services/snack.service';
import { NavigationObject } from '../models/NavigationObject';
import { VisitService } from '../services/visit.service';
import { CompanyService } from '../services/company.service';
import {
    ConfirmationDialogResponse,
    ConfirmationDialogComponent,
} from '../confirmation-dialog/confirmation-dialog.component';

@Component({
    selector: 'app-visit',
    templateUrl: './visit.component.html',
    styleUrls: ['./visit.component.css'],
    animations: [
        trigger('detailExpand', [
            state('collapsed', style({ height: '0px', minHeight: '0' })),
            state('expanded', style({ height: '*' })),
            transition(
                'expanded <=> collapsed',
                animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)'),
            ),
        ]),
    ],
})
export class VisitComponent implements OnInit {
    constructor(
        private storeService: StoreService,
        private snackService: SnackService,
        private visitService: VisitService,
        private companyService: CompanyService,
        private datePipe: DatePipe,
        private dialog: MatDialog,
    ) {}

    @ViewChild(MatPaginator) paginator: MatPaginator;
    patient: Patient;
    dataSource: MatTableDataSource<Store, MatTableDataSourcePaginator>;
    visitPoints: string[] = [];
    store: Store[];
    noteVal: string;
    showCheck = false;
    showFinish = false;
    showNext = false;
    showMrButton = false;
    showUpButton = false;
    date = new Date();
    isLoadingResults = true;
    company: Company;
    displayedColumns: string[] = [
        'negativePoint',
        'positivePoint',
        'type',
        'name',
        'image',
        'moreInfo',
    ];
    columnsToDisplayWithExpand = [...this.displayedColumns];
    expandedElement: any;
    groupReservoirsParents: any[]; // code starts with R
    groupMoreReservoirsParents: any[]; // code starts with MR
    groupUniversalParents: any[]; //code starts with P

    ngOnInit(): void {
        this.patient = {} as Patient;
        const urlPatient = history.state;
        if (this.checkIfPatient(urlPatient)) {
            this.patient = urlPatient;
        }
        this.storeService.getStore().subscribe({
            next: (data) => {
                this.store = data;
                data = orderBy(data, [(v) => v.code]);

                this.groupReservoirsParents = this.getTableData(data, 'R');
                this.dataSource = new MatTableDataSource<any>(
                    this.groupReservoirsParents,
                );
                this.dataSource.paginator = this.paginator;
                this.isLoadingResults = false;
            },
            error: (err) => {
                this.snackService.showSnackBarMessage(
                    'ERROR.PATIENT_VISIT_CREATE_PATIENT',
                    SNACK_TYPE.error,
                );
                console.log(err.message);
            },
        });
        this.companyService.getCompany().subscribe({
            next: (data) => {
                this.company = data;
            },
            error: (err) => {
                console.log(err);
            },
        });
    }

    selectPatient(patientSelected: Patient): void {
        this.patient = patientSelected;
    }

    clickedRow(row): void {
        if (!row.child) {
            const index = this.visitPoints.indexOf(row._id);
            if (index !== -1) {
                this.visitPoints.splice(index, 1);
                this.showCheck = false;
            } else {
                this.visitPoints.push(row._id);
            }
            this.paginatorPageChecker();
        }
    }

    toggleTableVisibility(): void {
        if (this.visitPoints.length >= 1) {
            const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
                data: {
                    title: 'CONFIRMATION_DIALOG.CLOSE_VISIT_TITLE',
                    message: 'PATIENT_VISIT.INFO.LOST',
                },
                disableClose: true,
            });
            dialogRef.afterClosed().subscribe((conf) => {
                if (conf === ConfirmationDialogResponse.OK) {
                    this.patient = {} as Patient;
                    this.showCheck = false;
                    this.showFinish = false;
                    this.showNext = false;
                    this.showMrButton = false;
                    this.showUpButton = false;
                    this.dataSource = new MatTableDataSource<any>(
                        this.groupReservoirsParents,
                    );
                    this.dataSource.paginator = this.paginator;
                    this.visitPoints = [];
                    console.clear();
                }
            });
        } else {
            this.patient = {} as Patient;
            this.visitPoints = [];
            this.dataSource = new MatTableDataSource<any>(
                this.groupReservoirsParents,
            );
            this.dataSource.paginator = this.paginator;
        }
    }

    @HostListener('document:keydown', ['$event'])
    handleKeyboardEvent(event: KeyboardEvent): void {
        if (event.key === 'ArrowRight' && this.paginator.hasNextPage()) {
            this.paginator.nextPage();
            this.paginatorPageChecker();
        } else if (
            event.key === 'ArrowLeft' &&
            this.paginator.hasPreviousPage()
        ) {
            this.paginator.previousPage();
            this.paginatorPageChecker();
        }
    }

    createVisitPointsTable(): void {
        this.dataSource = new MatTableDataSource<Store>(
            this.store.filter((s: Store) => this.visitPoints.includes(s._id)),
        );
        this.paginator.firstPage();
        this.dataSource.paginator = this.paginator;
        this.showFinish = true;
    }

    pageTriggerManually(): void {
        this.paginatorPageChecker();
    }

    sendVisit(): void {
        const visit: Visit = {
            patientId: this.patient._id,
            note: this.noteVal,
            points: this.visitPoints,
        };
        const pdfData = {
            fullName: this.patient.name + ' ' + this.patient.surname,
            logo: this.company.logo,
            genericInfo: this.company.genericInfo,
        };
        const docDefinition = {
            content: [
                {
                    text: this.datePipe.transform(Date.now(), 'dd.MM.yyyy'),
                    margin: [0, 10],
                },
                {
                    layout: 'noBorders',
                    table: {
                        widths: ['50%', '50%'],
                        body: [
                            [
                                {
                                    text: pdfData.fullName,
                                    alignment: 'left',
                                },
                                {
                                    image: pdfData.logo,
                                    width: 100,
                                    alignment: 'right',
                                },
                            ],
                        ],
                    },
                },
                {
                    text: pdfData.genericInfo,
                    margin: [0, 100],
                },
                {
                    table: {
                        widths: ['50%', '50%'],
                        body: this.visitPoints.map((point) =>
                            this.getPdfRow(point),
                        ),
                    },
                },
            ],
        };
        this.visitService.createVisit(visit).subscribe({
            next: (data) => {
                this.snackService.showSnackBarMessage(
                    'SUCCESS.PATIENT_VISIT_CREATE_VISIT',
                    SNACK_TYPE.success,
                );
                pdfMake.createPdf(docDefinition).open();
                console.log(data);
            },
            error: (error) => {
                this.snackService.showSnackBarMessage(
                    'ERROR.PATIENT_VISIT_CREATE_VISIT',
                    SNACK_TYPE.error,
                );
                console.log(error);
            },
        });
    }

    showMR(): void {
        this.groupMoreReservoirsParents = this.getTableData(this.store, 'MR');
        this.dataSource = new MatTableDataSource<any>(
            this.groupMoreReservoirsParents,
        );
        this.dataSource.paginator = this.paginator;
        this.paginator.firstPage();

        this.showNext = false;
        this.showUpButton = false;
        this.showMrButton = true;
        this.paginatorPageChecker();
    }

    showUP(): void {
        this.groupUniversalParents = this.getTableData(this.store, 'P');
        this.dataSource = new MatTableDataSource<any>(
            this.groupUniversalParents,
        );
        this.dataSource.paginator = this.paginator;
        this.paginator.firstPage();

        this.showNext = true;
        this.showUpButton = true;
        this.paginatorPageChecker();
    }

    private getTableData(data: Store[], codeLetter: string) {
        const group = data.filter((d) => d.code.startsWith(codeLetter));
        return [
            ...new Map(
                group
                    .map((gr) => {
                        if (gr.parent.length > 0) {
                            const parentObj = {
                                negativePoint: gr.parent,
                                child: group.filter(
                                    (g) => g.parent === gr.parent,
                                ),
                            };
                            return parentObj;
                        } else {
                            return gr;
                        }
                    })
                    .map((item) => [item['negativePoint'], item]),
            ).values(),
        ];
    }

    private getPdfRow(point: string) {
        return [
            {
                text: point,
            },
            {
                image: this.store.find((s: Store) => s._id === point).image,
                width: 100,
                alignment: 'center',
            },
        ];
    }

    private paginatorPageChecker() {
        if (!this.paginator.hasNextPage() && this.visitPoints.length >= 0) {
            this.showCheck = true;
        } else {
            this.showCheck = false;
        }
    }

    private checkIfPatient(
        object: Patient | NavigationObject,
    ): object is Patient {
        return Object.hasOwn(object, 'name');
    }
}
