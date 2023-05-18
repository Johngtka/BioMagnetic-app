import {
    Component,
    EventEmitter,
    Output,
    Input,
    OnChanges,
    OnInit,
    SimpleChanges,
} from '@angular/core';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';

import { Patient } from '../models/patient';
import { SNACK_TYPE } from './../services/snack.service';
import { SnackService } from './../services/snack.service';
import { PatientService } from './../services/patient-service';
import {
    ConfirmationDialogResponse,
    ConfirmationDialogComponent,
} from '../confirmation-dialog/confirmation-dialog.component';

@Component({
    selector: 'app-patient-table',
    templateUrl: './patient-table.component.html',
    styleUrls: ['./patient-table.component.css'],
})
export class PatientTableComponent implements OnInit, OnChanges {
    @Output() updatePatient = new EventEmitter<Patient>();
    @Input() newOrUpdatedPatient: Patient;
    dataSource!: Patient[];
    isLoadingResults = true;

    constructor(
        private patientService: PatientService,
        private snackService: SnackService,
        private route: Router,
        private dialog: MatDialog,
    ) {}
    ngOnChanges(changes: SimpleChanges): void {
        if (changes['newOrUpdatedPatient'] && !!this.dataSource) {
            const tablePatientIndex = this.dataSource.findIndex(
                (ds: Patient) =>
                    ds._id === changes['newOrUpdatedPatient'].currentValue._id,
            );

            if (tablePatientIndex !== -1) {
                // update
                this.dataSource[tablePatientIndex] =
                    changes['newOrUpdatedPatient'].currentValue;
                this.dataSource = [...this.dataSource];
            } else {
                // new
                this.dataSource = [
                    ...this.dataSource,
                    changes['newOrUpdatedPatient'].currentValue,
                ];
            }
        }
    }
    ngOnInit(): void {
        this.patientService.getPatients().subscribe({
            next: (data: Array<Patient>) => {
                this.dataSource = data;
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
                        this.dataSource = this.dataSource.filter(
                            (ds: Patient) => ds._id !== patient._id,
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
