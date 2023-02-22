import { Component } from '@angular/core';

import { SnackService, SNACK_TYPE } from './../services/snack.service';
import { Patient } from '../models/patient';
import { PatientService } from './../services/patient-service';
@Component({
    selector: 'app-patient-table',
    templateUrl: './patient-table.component.html',
    styleUrls: ['./patient-table.component.css'],
})
export class PatientTableComponent {
    dataSource!: any[];
    isLoadingResults = false
    constructor(
        private patientService: PatientService,
        private snackService: SnackService,
    ) { }
    ngOnInit(): void {
        this.isLoadingResults = true
        this.patientService.getPatients().subscribe({
            next: (data: Array<Patient>) => (this.dataSource = data),
            error: (err) => {
                this.snackService.showSnackBarMessage(
                    'ERROR.PATIENT_TABLE_GET_PATIENTS',
                    SNACK_TYPE.error,
                );
                console.log(err.message);
            },
        });
    }
    displayedColumns: string[] = [
        'fullname',
        'gender',
        'email',
        'phone',
        'location',
        'dob',
    ];
}
