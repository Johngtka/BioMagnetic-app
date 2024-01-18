import { Component, Inject, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { Validators } from '@angular/forms';
import { FormControl } from '@angular/forms';

import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

import { Patient } from '../models/patient';
import { SNACK_TYPE } from './../services/snack.service';
import { SnackService } from '../services/snack.service';
import { PatientService } from '../services/patient-service';

@Component({
    selector: 'app-user-input-dial',
    templateUrl: './user-input-dial.component.html',
    styleUrls: ['./user-input-dial.component.css'],
})
export class UserInputDialogComponent implements OnInit {
    constructor(
        private patientService: PatientService,
        private snackService: SnackService,
        private dialogRef: MatDialogRef<UserInputDialogComponent>,
        @Inject(MAT_DIALOG_DATA) public data: { patient: Patient },
    ) {}

    isEdit: boolean;
    buttonText: string;
    registerForm: FormGroup;
    originalFormValues: Patient;

    ngOnInit(): void {
        if (this.data?.patient) {
            this.isEdit = true;
            this.buttonText = 'PATIENT_CREATE.DIALOG.UPDATE';
            this.registerForm = new FormGroup({
                name: new FormControl(this.data.patient.name, [
                    Validators.required,
                ]),
                surname: new FormControl(this.data.patient.surname, [
                    Validators.required,
                ]),
                dob: new FormControl(this.data.patient.dob),
                gender: new FormControl(this.data.patient.gender),
                email: new FormControl(this.data.patient.email, [
                    Validators.required,
                    Validators.email,
                ]),
                phone: new FormControl(this.data.patient.phone, [
                    Validators.required,
                    Validators.pattern('^[0-9]*$'),
                ]),
                location: new FormControl(this.data.patient.location),
            });
        } else {
            this.isEdit = false;
            this.buttonText = 'PATIENT_CREATE.DIALOG.REGISTER';
            this.registerForm = new FormGroup({
                name: new FormControl('', [Validators.required]),
                surname: new FormControl('', [Validators.required]),
                dob: new FormControl(),
                gender: new FormControl(),
                email: new FormControl('', [
                    Validators.required,
                    Validators.email,
                ]),
                phone: new FormControl('', [
                    Validators.required,
                    Validators.pattern('^[0-9]*$'),
                ]),
                location: new FormControl(),
            });
        }
        this.originalFormValues = this.registerForm.value;
    }

    get email() {
        return this.registerForm.get('email');
    }

    get phone() {
        return this.registerForm.get('phone');
    }

    addPatient() {
        const patient = this.registerForm.value;
        if (this.isEdit) {
            patient._id = this.data.patient._id;
            this.patientService.updatePatient(patient).subscribe({
                next: (updatePatient: Patient) => (
                    this.snackService.showSnackBarMessage(
                        'SUCCESS.USER_INPUT_DIALOG_UPDATE_PATIENT',
                        SNACK_TYPE.success,
                    ),
                    this.dialogRef.close(updatePatient)
                ),
                error: () =>
                    this.snackService.showSnackBarMessage(
                        'ERROR.USER_INPUT_DIALOG_UPDATE_PATIENT',
                        SNACK_TYPE.error,
                    ),
            });
        } else {
            this.patientService.createPatient(patient).subscribe({
                next: (newPatient: Patient) => (
                    this.snackService.showSnackBarMessage(
                        'SUCCESS.USER_INPUT_DIALOG_CREATE_PATIENT',
                        SNACK_TYPE.success,
                    ),
                    this.dialogRef.close(newPatient)
                ),
                error: () =>
                    this.snackService.showSnackBarMessage(
                        'ERROR.USER_INPUT_DIALOG_CREATE_PATIENT',
                        SNACK_TYPE.error,
                    ),
            });
        }
    }

    hasChange() {
        return (
            JSON.stringify(this.registerForm.value) !==
            JSON.stringify(this.originalFormValues)
        );
    }
}
