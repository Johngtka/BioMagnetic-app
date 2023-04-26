import { Component, OnInit, ViewChild, HostListener } from '@angular/core';

import { MatPaginator } from '@angular/material/paginator';
import {
    MatTableDataSource,
    MatTableDataSourcePaginator,
} from '@angular/material/table';
import { MatDialog } from '@angular/material/dialog';

import { Store } from '../models/store';
import { Patient } from '../models/patient';
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
    @ViewChild(MatPaginator) paginator: MatPaginator;
    constructor(
        private storeService: StoreService,
        private snackService: SnackService,
        private dialog: MatDialog,
    ) {}
    patient!: Patient;
    displayedColumns: string[] = [
        'id',
        'negativePoint',
        'positivePoint',
        'name',
        'type',
        'image',
    ];
    dataSource:
        | Store[]
        | MatTableDataSource<Store, MatTableDataSourcePaginator>;
    visitPoints: number[] = [];
    ngOnInit(): void {
        this.patient = history.state;
        this.storeService.getStore().subscribe({
            next: (data) => (
                (this.dataSource = data.sort((a, b) => a.id - b.id)),
                (this.dataSource = new MatTableDataSource<Store>(
                    this.dataSource,
                )),
                (this.dataSource.paginator = this.paginator)
            ),
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
            console.log(this.visitPoints);
        } else {
            this.visitPoints.push(row.id);
            console.log(row.id);
        }
    }
    toggleTableVisibility(): void {
        if (this.visitPoints) {
            const dialogREf = this.dialog.open(ConfirmationDialogComponent, {
                data: {
                    title: 'Approve',
                    message: 'PATIENT_VISIT.INFO.LOST',
                },
                disableClose: true,
            });
            dialogREf.afterClosed().subscribe((conf) => {
                if (conf === ConfirmationDialogResponse.OK) {
                    this.patient = null;
                }
            });
        }
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
}
