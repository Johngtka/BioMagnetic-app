import { Component, OnInit, ViewChild, HostListener } from '@angular/core';
import { Router } from '@angular/router';

import { MatDialog } from '@angular/material/dialog';
import {
    MatTableDataSource,
    MatTableDataSourcePaginator,
} from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';

import { Patient } from '../models/patient';
import { SNACK_TYPE } from './../services/snack.service';
import { SnackService } from './../services/snack.service';
import { PatientService } from './../services/patient-service';
import { UserInputDialogComponent } from '../user-input-dialog/user-input-dial.component';
import {
    ConfirmationDialogResponse,
    ConfirmationDialogComponent,
} from '../confirmation-dialog/confirmation-dialog.component';

@Component({
    selector: 'app-patient-table',
    templateUrl: './patient-table.component.html',
    styleUrls: ['./patient-table.component.css'],
})
export class PatientTableComponent implements OnInit {
    constructor(
        private patientService: PatientService,
        private snackService: SnackService,
        private route: Router,
        private dialog: MatDialog,
    ) {}

    @ViewChild(MatPaginator) paginator: MatPaginator;
    patient: Patient[];
    dataSource!: MatTableDataSource<Patient, MatTableDataSourcePaginator>;
    isLoadingResults = true;
    displayedColumns: string[] = [
        'fullName',
        'email',
        'phone',
        'location',
        'dob',
        'actions',
    ];

    ngOnInit(): void {
        this.patientService.getPatients().subscribe({
            next: (data) => {
                this.patient = data;
                this.dataSource = new MatTableDataSource<Patient>(this.patient);
                this.dataSource.paginator = this.paginator;
                this.isLoadingResults = false;
            },
            error: (err) => {
                this.snackService.showSnackBarMessage(
                    'ERROR.PATIENT_TABLE_GET_PATIENTS',
                    SNACK_TYPE.error,
                );
                this.isLoadingResults = false;
                console.log(err.message);
            },
        });
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

    openDialog(patient?: Patient) {
        const dialogRef = this.dialog.open(UserInputDialogComponent, {
            data: { patient },
            disableClose: true,
        });
        dialogRef.afterClosed().subscribe((result: Patient) => {
            if (result) {
                this.updateTable(result);
            }
        });
    }
    startNewVisit(patient: Patient): void {
        this.route.navigate(['visit'], { state: patient });
    }

    showHistory(patient: Patient): void {
        this.route.navigate(['history'], { state: patient });
    }

    deletePatient(patient: Patient) {
        const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
            data: {
                title: 'CONFIRMATION_DIALOG.GENERIC_TITLE',
                message: 'CONFIRMATION_DIALOG.GENERIC_MESSAGE',
            },
            disableClose: true,
        });

        dialogRef.afterClosed().subscribe((result) => {
            if (result === ConfirmationDialogResponse.OK) {
                this.patientService.deletePatient(patient._id).subscribe({
                    next: () => {
                        this.patient = this.patient.filter(
                            (ds: Patient) => ds._id !== patient._id,
                        );
                        this.dataSource = new MatTableDataSource<Patient>(
                            this.patient,
                        );
                        this.snackService.showSnackBarMessage(
                            'SUCCESS.PATIENT_TABLE_DELETE_PATIENT',
                            SNACK_TYPE.success,
                        );
                    },
                    error: (err) => {
                        this.snackService.showSnackBarMessage(
                            'ERROR.PATIENT_TABLE_DELETE_PATIENT',
                            SNACK_TYPE.error,
                        );
                        this.isLoadingResults = false;
                        console.log(err.message);
                    },
                });
            }
        });
    }

    private updateTable(newOrUpdatedPatient: Patient) {
        if (!!this.patient && !!newOrUpdatedPatient) {
            const tablePatientIndex = this.patient.findIndex(
                (ds: Patient) => ds._id === newOrUpdatedPatient._id,
            );

            if (tablePatientIndex !== -1) {
                // update
                this.patient[tablePatientIndex] = newOrUpdatedPatient;
                this.patient = [...this.patient];
                this.dataSource = new MatTableDataSource<Patient>(this.patient);
            } else {
                // new
                this.patient = [...this.patient, newOrUpdatedPatient];
                this.dataSource = new MatTableDataSource<Patient>(this.patient);
            }
        }
    }
}
