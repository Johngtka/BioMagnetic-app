import { Component, Output, EventEmitter } from '@angular/core';
import { OnInit } from '@angular/core';

import { FormControl } from '@angular/forms';
import { debounceTime } from 'rxjs/operators';
import { tap } from 'rxjs/operators';
import { distinctUntilChanged } from 'rxjs/operators';
import { filter } from 'rxjs/operators';

import { PatientService } from '../services/patient-service';
import { Patient } from '../models/patient';
import { SnackService, SNACK_TYPE } from '../services/snack.service';

export interface User {
    name: string;
}
@Component({
    selector: 'app-patient-search',
    templateUrl: './patient-search.component.html',
    styleUrls: ['./patient-search.component.css'],
})
export class PatientSearchComponent implements OnInit {
    searchPatientsCtrl = new FormControl();
    filteredPatients!: Array<Patient>;
    @Output() selectedPatient = new EventEmitter<Patient>();
    isLoading = false;
    errorMsg!: string;
    minLengthTerm = 3;

    constructor(
        private patientService: PatientService,
        private snackService: SnackService,
    ) {}
    onSelected() {
        this.selectedPatient.emit(this.searchPatientsCtrl.value);
    }

    displayWith(value: any) {
        return value ? value.name : '';
    }

    clearSelection() {
        this.searchPatientsCtrl.setValue('');
        this.filteredPatients = [];
    }

    ngOnInit() {
        this.searchPatientsCtrl.valueChanges
            .pipe(
                filter((res) => {
                    return (
                        !!res &&
                        res !== null &&
                        res.length >= this.minLengthTerm
                    );
                }),
                distinctUntilChanged(),
                debounceTime(1000),
                tap(() => {
                    this.errorMsg = '';
                    this.filteredPatients = [];
                    this.isLoading = true;
                }),
            )
            .subscribe((query: string) => {
                this.patientService
                    .patientSearch(query)
                    .subscribe({
                        next: (data: Array<Patient>) =>
                            (this.filteredPatients = data),
                        error: (err) => {
                            this.snackService.showSnackBarMessage(
                                'ERROR.PATIENT_SEARCH',
                                SNACK_TYPE.error,
                            );
                            console.log(err.message);
                        },
                    })
                    .add(() => (this.isLoading = false));
            });
    }
}
