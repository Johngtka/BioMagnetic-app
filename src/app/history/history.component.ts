import {
    Component,
    OnInit,
    ViewChild,
    HostListener,
    OnDestroy,
} from '@angular/core';
import {
    trigger,
    state,
    style,
    transition,
    animate,
} from '@angular/animations';
import { DatePipe } from '@angular/common';
import { MatPaginator } from '@angular/material/paginator';
import {
    MatTableDataSource,
    MatTableDataSourcePaginator,
} from '@angular/material/table';
import { BreakpointObserver } from '@angular/cdk/layout';
import * as pdfMake from 'pdfmake/build/pdfmake';
import * as pdfFonts from 'pdfmake/build/vfs_fonts';
pdfMake.vfs = pdfFonts.pdfMake.vfs;

import { Subscription } from 'rxjs';
import { TranslateService } from '@ngx-translate/core';

import { Visit } from '../models/visit';
import { Store } from '../models/store';
import { Patient } from '../models/patient';
import { Company } from '../models/company';
import { VisitService } from '../services/visit.service';
import { CompanyService } from '../services/company.service';
import { SnackService, SNACK_TYPE } from '../services/snack.service';
import { NavigationObject } from '../models/NavigationObject';
import { StoreService } from '../services/store.service';

@Component({
    selector: 'app-history',
    templateUrl: './history.component.html',
    styleUrls: ['./history.component.css'],
    animations: [
        trigger('detailExpand', [
            state('collapsed,void', style({ height: '0px', minHeight: '0' })),
            state('expanded', style({ height: '*' })),
            transition(
                'expanded <=> collapsed',
                animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)'),
            ),
        ]),
    ],
})
export class HistoryComponent implements OnInit, OnDestroy {
    @ViewChild(MatPaginator) paginator: MatPaginator;
    store: any;
    company: Company;
    expandedElement: any;
    showSearch: boolean;
    universalPointsId: string[];
    patient: Patient;
    storeSubscription: Subscription;
    dataSource: MatTableDataSource<Visit, MatTableDataSourcePaginator>;
    isLoadingStore = true;
    showEmptyState = false;
    isLoadingResults = false;
    displayedColumns: string[] = ['date', 'points', 'note'];
    columnsToDisplayWithExpand = [...this.displayedColumns, 'expand'];
    isMobile: boolean;

    constructor(
        private datePipe: DatePipe,
        private visitService: VisitService,
        private snackService: SnackService,
        private storeService: StoreService,
        private companyService: CompanyService,
        private responsive: BreakpointObserver,
        private translateService: TranslateService,
    ) {}

    ngOnDestroy(): void {
        if (this.storeSubscription) {
            this.storeSubscription.unsubscribe();
        }
    }

    ngOnInit(): void {
        this.responsive.observe(['(max-width: 400px)']).subscribe((result) => {
            if (result.matches) {
                this.isMobile = true;
                this.displayedColumns.pop();
            } else {
                this.isMobile = false;
            }
            this.columnsToDisplayWithExpand = [
                ...this.displayedColumns,
                'expand',
            ];
        });
        this.storeSubscription = this.storeService
            .getStore()
            .subscribe((data) => {
                if (data.length > 0) {
                    this.store = data;
                    this.universalPointsId = data
                        .filter((d) => d.code.includes('P', 0))
                        .map((f) => f._id);

                    this.isLoadingStore = false;
                }
            });
        this.patient = {} as Patient;
        const urlPatient = history.state;
        if (this.checkIfPatient(urlPatient)) {
            this.patient = urlPatient;
            this.getPatientVisit();
        }
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
        this.showSearch = true;
        this.getPatientVisit();
    }

    toggleTableVisibility(): void {
        this.patient = {} as Patient;
        this.showEmptyState = false;
        this.dataSource = new MatTableDataSource<Visit>([]);
        console.clear();
    }

    @HostListener('document:keydown', ['$event'])
    handleKeyboardEvent(event: KeyboardEvent): void {
        if (event.key === 'ArrowRight' && this.paginator.hasNextPage()) {
            this.paginator.nextPage();
        } else if (
            event.key === 'ArrowLeft' &&
            this.paginator.hasPreviousPage()
        ) {
            this.paginator.previousPage();
        }
    }

    reDoPdf() {
        //TODO re-create a pdf
        const visit: Visit = {
            patientId: this.patient._id,
            note: this.store.comment,
            points: this.store.map((vp) => {
                return { id: vp._id, comment: vp.comment };
            }),
        };
        const pdfData = {
            fullName: this.patient.surname,
            logo: this.company.logo,
            image: this.company.image,
        };

        const docDefinition = {
            content: [
                {
                    image: pdfData.logo,
                },
                {
                    text: `${this.translateService
                        .instant('PATIENT_VISIT.PDF.TITLE')
                        .toUpperCase()} - ${pdfData.fullName.toUpperCase()} ${this.datePipe.transform(
                        Date.now(),
                        'dd/MM/yyyy',
                    )}`,
                    margin: [0, 10],
                },
                {
                    table: {
                        dontBreakRows: false,
                        headerRows: 1,
                        widths: [150, '*', 150],
                        body: this.store
                            .filter((vt) => vt.code.includes('P', 0))
                            .map((point) => this.getPdfRow(point)),
                    },
                },
                {
                    text: `${this.translateService.instant(
                        'PATIENT_VISIT.PDF.GENERIC.REMEMBER',
                    )}`,
                    color: '#92cddc',
                    pageBreak: 'before',
                    margin: [0, 10],
                    lineHeight: 2,
                    bold: true,
                },
                {
                    ul: [
                        this.translateService.instant(
                            'PATIENT_VISIT.PDF.GENERIC.POINT_1',
                        ),
                        this.translateService.instant(
                            'PATIENT_VISIT.PDF.GENERIC.POINT_2',
                        ),
                    ],
                    margin: [60, 0],
                    lineHeight: 2,
                },
                {
                    text: `${this.translateService.instant(
                        'PATIENT_VISIT.PDF.GENERIC.EMAIL',
                    )}: ${this.company.email}`,
                    color: '#92cddc',
                    margin: [0, 10],
                    lineHeight: 2,
                    bold: true,
                },
                {
                    text: `${this.translateService.instant(
                        'PATIENT_VISIT.PDF.GENERIC.TEXT',
                    )}`,
                    lineHeight: 2,
                },
                {
                    image: pdfData.image,
                    width: 520,
                    margin: [0, 10],
                },
            ],
        };
        // add table headers
        docDefinition.content[2].table.body.unshift([
            {
                text: this.translateService
                    .instant('PATIENT_VISIT.PDF.IMBALANCE')
                    .toUpperCase(),
                alignment: 'center',
                bold: true,
                borderColor: ['#31849b', '#31849b', '#31849b', '#31849b'],
                fillColor: '#92cddc',
                color: 'white',
                margin: [0, 10, 0, 10],
            } as any,
            {
                text: this.translateService
                    .instant('PATIENT_VISIT.PDF.POSITION')
                    .toUpperCase(),
                alignment: 'center',
                bold: true,
                borderColor: ['#31849b', '#31849b', '#31849b', '#31849b'],
                fillColor: '#92cddc',
                color: 'white',
                margin: [0, 10, 0, 10],
            },
            {
                text: this.translateService
                    .instant('PATIENT_VISIT.PDF.INFO')
                    .toUpperCase(),
                bold: true,
                alignment: 'center',
                borderColor: ['#31849b', '#31849b', '#31849b', '#31849b'],
                fillColor: '#92cddc',
                color: 'white',
                margin: [0, 10, 0, 10],
            },
        ]);

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

                // this.toggleTableVisibility(true);
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

    private getPatientVisit(): void {
        this.isLoadingResults = true;
        this.visitService.getVisits(this.patient._id).subscribe({
            next: (data) => {
                if (data.length === 0) {
                    this.showEmptyState = true;
                }
                this.dataSource = new MatTableDataSource<Visit>(data);
                this.isLoadingResults = false;
                this.dataSource.paginator = this.paginator;
            },
            error: (err) => {
                this.isLoadingResults = false;
                console.log(err);
            },
        });
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

    private checkIfPatient(
        object: Patient | NavigationObject,
    ): object is Patient {
        return Object.hasOwn(object, 'name');
    }
}
