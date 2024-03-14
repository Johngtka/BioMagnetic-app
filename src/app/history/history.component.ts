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

import { Visit } from '../models/visit';
import { Patient } from '../models/patient';
import { Company } from '../models/company';
import { VisitService } from '../services/visit.service';
import { NavigationObject } from '../models/NavigationObject';
import { StoreService } from '../services/store.service';
import { PdfService } from '../services/pdf.service';

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
    visitGenerally: Visit[];

    constructor(
        private visitService: VisitService,
        private storeService: StoreService,
        private responsive: BreakpointObserver,
        private pdfService: PdfService,
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

    reDoPdf(visitId: string) {
        const visit = JSON.parse(
            JSON.stringify(
                this.dataSource.filteredData.find(
                    (ds) => (ds as any)._id === visitId,
                ),
            ),
        );

        visit.points = visit.points.map((v) => {
            return { ...this.findImageById(v.id), comment: v.comment };
        });

        const docDefinition = this.pdfService.preparePdf(
            visit.points,
            this.patient,
        );

        if (!this.isMobile) {
            pdfMake.createPdf(docDefinition).open();
        }
        if (this.isMobile) {
            const doc = pdfMake.createPdf(docDefinition);
            doc.getBase64((data) => {
                window.location.href = 'data:application/pdf;base64,' + data;
            });
        }
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
                this.visitGenerally = data;
            },
            error: (err) => {
                this.isLoadingResults = false;
                console.log(err);
            },
        });
    }

    private checkIfPatient(
        object: Patient | NavigationObject,
    ): object is Patient {
        return Object.hasOwn(object, 'name');
    }

    private findImageById(storeId: string): any {
        return this.store.find((s) => s._id === storeId);
    }
}
