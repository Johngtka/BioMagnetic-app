import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';

import { Patient } from '../models/patient';
import { SNACK_TYPE } from './../services/snack.service';
import { SnackService } from './../services/snack.service';
import { PatientService } from './../services/patient-service';
import {
    ConfirmationDialogComponent,
    ConfirmationDialogResponse,
} from '../confirmation-dialog/confirmation-dialog.component';

@Component({
    selector: 'app-patient-table',
    templateUrl: './patient-table.component.html',
    styleUrls: ['./patient-table.component.css'],
})
export class PatientTableComponent {
    dataSource!: Patient[];
    isLoadingResults = true;
    constructor(
        private patientService: PatientService,
        private snackService: SnackService,
        private route: Router,
        public dialog: MatDialog,
    ) {}
    ngOnInit(): void {
        this.patientService.getPatients().subscribe({
            next: (data: Array<Patient>) => (
                (this.dataSource = data), (this.isLoadingResults = false)
            ),
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
    startNewVisit(patient: Patient): void {
        this.route.navigate(['visit'], { state: patient });
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
                        this.dataSource = this.dataSource.filter(
                            (ds: Patient) => ds._id !== patient._id,
                        );
                        this.snackService.showSnackBarMessage(
                            'SUCCESS.PATIENT_TABLE_DELETE_PATIENTS',
                            SNACK_TYPE.success,
                        );
                    },
                    error: (err) => {
                        this.snackService.showSnackBarMessage(
                            'ERROR.PATIENT_TABLE_DELETE_PATIENTS',
                            SNACK_TYPE.error,
                        );
                        this.isLoadingResults = false;
                        console.log(err.message);
                    },
                });
            }
        });
    }

    displayedColumns: string[] = [
        'fullName',
        'gender',
        'email',
        'phone',
        'location',
        'dob',
        'actions',
    ];
}
