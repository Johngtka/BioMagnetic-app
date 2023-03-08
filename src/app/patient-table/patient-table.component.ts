import { Component } from '@angular/core';

import { Router } from '@angular/router';
import { Patient } from '../models/patient';
import { SnackService } from './../services/snack.service';
import { SNACK_TYPE } from './../services/snack.service';
import { PatientService } from './../services/patient-service';
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
    displayedColumns: string[] = [
        'fullname',
        'gender',
        'email',
        'phone',
        'location',
        'dob',
    ];
}
