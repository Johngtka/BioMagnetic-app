import {
    Component,
    OnInit,
    ViewChild,
    HostListener,
    OnDestroy,
} from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import {
    MatTableDataSource,
    MatTableDataSourcePaginator,
} from '@angular/material/table';

import { Subscription } from 'rxjs';

import { Visit } from '../models/visit';
import { Patient } from '../models/patient';
import { VisitService } from '../services/visit.service';
import { NavigationObject } from '../models/NavigationObject';
import { StoreService } from '../services/store.service';
import {
    trigger,
    state,
    style,
    transition,
    animate,
} from '@angular/animations';

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
    showSearch: boolean;
    patient: Patient;
    dataSource: MatTableDataSource<Visit, MatTableDataSourcePaginator>;
    displayedColumns: string[] = ['date', 'points', 'note'];
    showEmptyState = false;
    isLoadingResults = false;
    storeSubscription: Subscription;
    store: any;
    isLoadingStore = true;

    columnsToDisplayWithExpand = [...this.displayedColumns, 'expand'];
    expandedElement: any;

    universalPointsId: string[];

    constructor(
        private visitService: VisitService,
        private storeService: StoreService,
    ) {}
    ngOnDestroy(): void {
        if (this.storeSubscription) {
            this.storeSubscription.unsubscribe();
        }
    }

    ngOnInit(): void {
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

    private checkIfPatient(
        object: Patient | NavigationObject,
    ): object is Patient {
        return Object.hasOwn(object, 'name');
    }
}
