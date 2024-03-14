import {
    Component,
    OnInit,
    ViewChild,
    HostListener,
    AfterViewInit,
    OnDestroy,
} from '@angular/core';
import {
    trigger,
    state,
    style,
    transition,
    animate,
} from '@angular/animations';
import { BreakpointObserver } from '@angular/cdk/layout';
import { Router } from '@angular/router';

import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import {
    MatTableDataSource,
    MatTableDataSourcePaginator,
} from '@angular/material/table';
import * as pdfMake from 'pdfmake/build/pdfmake';
import * as pdfFonts from 'pdfmake/build/vfs_fonts';
pdfMake.vfs = pdfFonts.pdfMake.vfs;

import { orderBy } from 'natural-orderby';
import { Subscription } from 'rxjs';

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
import { PdfService } from '../services/pdf.service';

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
export class VisitComponent implements OnInit, AfterViewInit, OnDestroy {
    constructor(
        private storeService: StoreService,
        private snackService: SnackService,
        private visitService: VisitService,
        private companyService: CompanyService,
        private responsive: BreakpointObserver,
        private dialog: MatDialog,
        private router: Router,
        private pdfService: PdfService,
    ) {}

    @ViewChild(MatPaginator) paginator: MatPaginator;
    expandedElement: any;
    groupReservoirsParents: any[]; // code starts with R
    groupMoreReservoirsParents: any[]; // code starts with MR
    groupUniversalParents: any[]; //code starts with P
    noteVal: string;
    patient: Patient;
    store: Store[];
    company: Company;
    storeSubscription: Subscription;
    dataSource: MatTableDataSource<Store, MatTableDataSourcePaginator>;

    showCheck = false;
    showFinish = false;
    showNext = false;
    showMRButton = false;
    showUPButton = false;
    showTable1 = true;
    showTable2 = false;
    showTable3 = false;
    showTable4 = false;
    showTable5 = false;
    isMobile = false;
    isLoadingResults = true;
    visitPoints: Store[] = [];
    justIds: string[] = [];
    date = new Date();
    displayedColumns: string[] = [
        'negativePoint',
        'positivePoint',
        'type',
        'name',
        'image',
        'moreInfo',
    ];
    displayedColumnsForMobiles: string[] = ['image', 'point'];
    columnsToDisplayWithExpand = [...this.displayedColumns];
    columnsToDisplayWithExpandOnPhones = [...this.displayedColumnsForMobiles];

    ngOnInit(): void {
        this.patient = {} as Patient;
        const urlPatient = history.state;
        if (this.checkIfPatient(urlPatient)) {
            this.patient = urlPatient;
        }
        this.storeSubscription = this.storeService
            .getStore()
            .subscribe((data) => {
                if (data.length > 0) {
                    this.store = data;
                    this.store = orderBy(this.store, [(v) => v.code]);
                    this.isLoadingResults = false;
                    this.loadPaginator();
                }
            });
        this.responsive.observe(['(max-width: 600px)']).subscribe((result) => {
            if (result.matches) {
                this.isMobile = true;
                this.loadPaginator();
            } else {
                this.isMobile = false;
                this.loadPaginator();
            }
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

    ngAfterViewInit() {
        this.loadPaginator();
    }

    ngOnDestroy(): void {
        if (this.storeSubscription) {
            this.storeSubscription.unsubscribe();
        }
    }

    loadPaginator() {
        if (!!this.store && this.store.length) {
            this.groupReservoirsParents = this.getTableData(this.store, 'R');
            this.dataSource = new MatTableDataSource<any>(
                this.groupReservoirsParents,
            );
            this.dataSource.paginator = this.paginator;
        }
    }

    selectPatient(patientSelected: Patient): void {
        this.patient = patientSelected;
    }

    clickedRow(row): void {
        if (!row.child) {
            const index = this.visitPoints.findIndex(
                (vp) => vp._id === row._id,
            );
            if (index !== -1) {
                this.visitPoints.splice(index, 1);
                this.justIds = this.visitPoints.map((vp) => vp._id);
            } else {
                this.visitPoints.push(row);
                this.visitService.getBetterQualityOfImage(row.code).subscribe({
                    next: (data) => {
                        let childIndex = -1;
                        const index = this.dataSource.data.findIndex(
                            (value) => {
                                if ((value as any).child) {
                                    childIndex = (value as any).child.findIndex(
                                        (ch) => ch.code === data.code,
                                    );

                                    if (childIndex !== -1) {
                                        return true;
                                    }
                                }
                                return value.code === data.code;
                            },
                        );
                        if (childIndex !== -1) {
                            (this.dataSource.data[index] as any).child[
                                childIndex
                            ].image = data.image;
                        } else {
                            this.dataSource.data[index].image = data.image;
                        }
                    },
                    error: (err) => {
                        console.log(err);
                    },
                });
                this.justIds = this.visitPoints.map((vp) => vp._id);
            }
            this.paginatorPageChecker();
        }
    }

    toggleTableVisibility(close?: boolean): void {
        if (close) {
            this.resetVariables();
            this.router.navigate(['patient/details']);
        } else {
            if (this.visitPoints.length >= 1) {
                const dialogRef = this.dialog.open(
                    ConfirmationDialogComponent,
                    {
                        data: {
                            title: 'CONFIRMATION_DIALOG.CLOSE_VISIT_TITLE',
                            message: 'PATIENT_VISIT.INFO.LOST',
                        },
                        disableClose: true,
                    },
                );
                dialogRef.afterClosed().subscribe((conf) => {
                    if (conf === ConfirmationDialogResponse.OK) {
                        this.resetVariables();
                    }
                });
            } else {
                this.resetVariables();
            }
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

    createVisitPointsTable(stage: string): void {
        if (stage === 'I') {
            this.dataSource = new MatTableDataSource<Store>(
                this.visitPoints.filter(
                    (vp) => vp.code.startsWith('R') || vp.code.startsWith('MR'),
                ),
            );
        } else {
            this.showTable4 = false;
            this.showTable5 = true;
            if (!this.isMobile) {
                this.columnsToDisplayWithExpand.push('note');
            }

            if (this.isMobile) {
                this.displayedColumnsForMobiles.push('note');
            }

            this.visitPoints = this.visitPoints.map((point) => {
                return { ...point, comment: '' };
            });
            const points = this.visitPoints.filter((vp) =>
                vp.code.startsWith('P'),
            );
            this.dataSource = new MatTableDataSource<Store>(points);
        }

        this.paginator.firstPage();
        this.dataSource.paginator = this.paginator;
        this.paginatorPageChecker();
    }

    pageTriggerManually(): void {
        this.paginatorPageChecker();
    }

    sendVisit(): void {
        const visit: Visit = {
            patientId: this.patient._id,
            note: this.noteVal,
            points: this.visitPoints.map((vp) => {
                return { id: vp._id, comment: vp.comment };
            }),
        };

        const docDefinition = this.pdfService.preparePdf(
            this.visitPoints,
            this.patient,
        );

        this.visitService.createVisit(visit).subscribe({
            next: () => {
                this.snackService.showSnackBarMessage(
                    'SUCCESS.PATIENT_VISIT_CREATE_VISIT',
                    SNACK_TYPE.success,
                );
                if (!this.isMobile) {
                    pdfMake.createPdf(docDefinition).open();
                }
                if (this.isMobile) {
                    const doc = pdfMake.createPdf(docDefinition);
                    doc.getBase64((data) => {
                        window.location.href =
                            'data:application/pdf;base64,' + data;
                    });
                }

                this.toggleTableVisibility(true);
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
        this.showTable1 = false;
        this.showTable2 = true;
        this.showTable3 = false;
        this.groupMoreReservoirsParents = this.getTableData(this.store, 'MR');
        this.dataSource = new MatTableDataSource<any>(
            this.groupMoreReservoirsParents,
        );
        this.dataSource.paginator = this.paginator;
        this.paginator.firstPage();
        this.paginatorPageChecker();
    }

    showSummary1() {
        this.showTable1 = false;
        this.showTable2 = false;
        if (this.visitPoints.length > 0) {
            this.showTable3 = true;
            this.createVisitPointsTable('I');
        } else {
            this.showTable3 = false;
            this.showUP();
        }
    }

    showUP(): void {
        this.showTable1 = false;
        this.showTable2 = false;
        this.showTable3 = false;
        this.showTable4 = true;
        this.groupUniversalParents = this.getTableData(this.store, 'P');
        this.dataSource = new MatTableDataSource<any>(
            this.groupUniversalParents,
        );
        this.dataSource.paginator = this.paginator;
        this.paginator.firstPage();
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

    private getPdfRow(point: Store) {
        return [
            {
                text: point.negativePoint + '-' + point.positivePoint,
                alignment: 'center',
                borderColor: ['#31849b', '#31849b', '#31849b', '#31849b'],
            },
            {
                image: point.image,
                width: 200,
                alignment: 'center',
                borderColor: ['#31849b', '#31849b', '#31849b', '#31849b'],
            },
            {
                text: point.comment,
                alignment: 'center',
                italics: true,
                borderColor: ['#31849b', '#31849b', '#31849b', '#31849b'],
            },
        ];
    }

    private paginatorPageChecker() {
        setTimeout(() => {
            if (!this.paginator.hasNextPage()) {
                if (this.showTable1) {
                    this.showCheck = false;
                    this.showFinish = false;
                    this.showNext = false;
                    this.showMRButton = true;
                    this.showUPButton = true;
                } else if (this.showTable2) {
                    this.showCheck = false;
                    this.showFinish = false;
                    this.showNext = false;
                    this.showMRButton = false;
                    this.showUPButton = true;
                } else if (this.showTable3) {
                    this.showCheck = false;
                    this.showFinish = false;
                    this.showNext = true;
                    this.showMRButton = false;
                    this.showUPButton = false;
                } else if (this.showTable4) {
                    this.showCheck = true;
                    this.showFinish = false;
                    this.showNext = false;
                    this.showMRButton = false;
                    this.showUPButton = false;
                } else if (this.showTable5) {
                    this.showCheck = false;
                    this.showFinish = true;
                    this.showNext = false;
                    this.showMRButton = false;
                    this.showUPButton = false;
                }
            } else {
                this.showCheck = false;
                this.showFinish = false;
                this.showNext = false;
                this.showMRButton = false;
                this.showUPButton = false;
            }
        }, 100);
    }

    private checkIfPatient(
        object: Patient | NavigationObject,
    ): object is Patient {
        return Object.hasOwn(object, 'name');
    }

    private resetVariables() {
        this.patient = {} as Patient;
        this.dataSource = new MatTableDataSource<any>(
            this.groupReservoirsParents,
        );
        this.dataSource.paginator = this.paginator;
        this.paginator.firstPage();
        this.visitPoints = [];
        this.justIds = [];

        this.showCheck = false;
        this.showFinish = false;
        this.showNext = false;
        this.showMRButton = false;
        this.showUPButton = false;

        this.showTable1 = true;
        this.showTable2 = false;
        this.showTable3 = false;
        this.showTable4 = false;
        this.showTable5 = false;

        this.displayedColumnsForMobiles = ['image', 'point'];
        this.columnsToDisplayWithExpand = [...this.displayedColumns];
    }
}
