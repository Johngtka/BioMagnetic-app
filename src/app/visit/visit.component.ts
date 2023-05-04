import { Component, OnInit, ViewChild, HostListener } from '@angular/core';

import { MatPaginator } from '@angular/material/paginator';
import {
    MatTableDataSource,
    MatTableDataSourcePaginator,
} from '@angular/material/table';
import { MatDialog } from '@angular/material/dialog';

import { Store } from '../models/store';
import { Patient } from '../models/patient';
import { NavigationObject } from '../models/NavigationObject';
import { StoreService } from '../services/store.service';
import { SnackService, SNACK_TYPE } from '../services/snack.service';
import {
    ConfirmationDialogComponent,
    ConfirmationDialogResponse,
} from '../confirmation-dialog/confirmation-dialog.component';

@Component({
    selector: 'app-visit',
    templateUrl: './visit.component.html',
    styleUrls: ['./visit.component.css'],
})
export class VisitComponent implements OnInit {
    constructor(
        private storeService: StoreService,
        private snackService: SnackService,
        private dialog: MatDialog,
    ) {}
    @ViewChild(MatPaginator) paginator: MatPaginator;
    patient: Patient;
    displayedColumns: string[] = [
        'id',
        'negativePoint',
        'positivePoint',
        'name',
        'type',
        'image',
    ];
    dataSource: MatTableDataSource<Store, MatTableDataSourcePaginator>;
    visitPoints: number[] = [];
    store: Store[];
    noteVal: string;
    showCheck = false;
    showFinish = false;
    ngOnInit(): void {
        this.patient = {} as Patient;
        const urlPatient = history.state;
        if (this.checkIfPatient(urlPatient)) {
            this.patient = urlPatient;
        }
        this.storeService.getStore().subscribe({
            next: (data) => {
                this.store = data.sort((a, b) => a.id - b.id);
                this.dataSource = new MatTableDataSource<Store>(this.store);
                this.dataSource.paginator = this.paginator;
            },
            error: (err) => {
                this.snackService.showSnackBarMessage(
                    'ERROR.PATIENT_VISIT_CREATE_PATIENT',
                    SNACK_TYPE.error,
                );
                console.log(err.message);
            },
        });
    }
    selectPatient(patientSelected: Patient): void {
        this.patient = patientSelected;
    }
    clickedRow(row): void {
        const index = this.visitPoints.indexOf(row.id);
        if (index !== -1) {
            this.visitPoints.splice(index, 1);
            this.showCheck = false;
        } else {
            this.visitPoints.push(row.id);
        }
        if (!this.paginator.hasNextPage() && this.visitPoints.length >= 1) {
            this.showCheck = true;
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
                    this.visitPoints = [];
                    this.showFinish = false;
                    this.dataSource = new MatTableDataSource<Store>(this.store);
                    this.dataSource.paginator = this.paginator;
                    console.clear();
                }
            });
        } else {
            this.patient = {} as Patient;
        }
    }
    @HostListener('document:keydown', ['$event'])
    handleKeyboardEvent(event: KeyboardEvent): void {
        if (event.key === 'ArrowRight' && this.paginator.hasNextPage()) {
            this.paginator.nextPage();
            if (!this.paginator.hasNextPage() && this.visitPoints.length >= 1) {
                this.showCheck = true;
            }
        } else if (
            event.key === 'ArrowLeft' &&
            this.paginator.hasPreviousPage()
        ) {
            this.paginator.previousPage();
            if (this.paginator.hasPreviousPage()) {
                this.showCheck = false;
            }
        }
    }

    private checkIfPatient(
        object: Patient | NavigationObject,
    ): object is Patient {
        return Object.hasOwn(object, 'name');
    }

    createVisitPointsTable(): void {
        this.dataSource = new MatTableDataSource<Store>(
            this.store.filter((s: Store) => this.visitPoints.includes(s.id)),
        );
        this.paginator.firstPage();
        this.showFinish = true;
        this.showCheck = false;
        this.dataSource.paginator = this.paginator;
    }

    pageTriggerManually(): void {
        if (!this.paginator.hasNextPage() && this.visitPoints.length >= 1) {
            this.showCheck = true;
        }
    }

    printNote(): void {
        console.log(this.noteVal, this.dataSource.data);
    }
}
