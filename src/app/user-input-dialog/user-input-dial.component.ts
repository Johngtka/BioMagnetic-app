import { Component } from '@angular/core';
import { DialogRef } from '@angular/cdk/dialog';
import { FormGroup } from '@angular/forms';
import { FormControl } from '@angular/forms';
import { Validators } from '@angular/forms';

import { PatientService } from '../services/patient-service';
import { SnackService } from '../services/snack.service';
import { SNACK_TYPE } from './../services/snack.service';
@Component({
    selector: 'app-user-input-dial',
    templateUrl: './user-input-dial.component.html',
    styleUrls: ['./user-input-dial.component.css'],
})
export class UserInputDialogComponent {
    constructor(
        private patientService: PatientService,
        private snackService: SnackService,
        private dialref: DialogRef,
    ) {}
    registerForm = new FormGroup({
        name: new FormControl('', [Validators.required]),
        surname: new FormControl('', [Validators.required]),
        dob: new FormControl(),
        gender: new FormControl(),
        email: new FormControl('', [Validators.required, Validators.email]),
        phone: new FormControl('', [
            Validators.required,
            Validators.pattern('^[0-9]*$'),
        ]),
        location: new FormControl(),
    });

    get email() {
        return this.registerForm.get('email');
    }

    get phone() {
        return this.registerForm.get('phone');
    }

    addPatient() {
        const patient = this.registerForm.value;
        this.patientService.createPatient(patient).subscribe({
            next: () => (
                this.snackService.showSnackBarMessage(
                    'SUCCESS.USER_INPUT_DIALOG_CREATE_PATIENT',
                    SNACK_TYPE.success,
                ),
                this.dialref.close()
            ),
            error: () =>
                this.snackService.showSnackBarMessage(
                    'ERROR.USER_INPUT_DIALOG_CREATE_PATIENT',
                    SNACK_TYPE.error,
                ),
        });
    }
}
