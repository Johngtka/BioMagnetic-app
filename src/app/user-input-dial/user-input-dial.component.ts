import { Component } from '@angular/core';

import { FormGroup } from '@angular/forms';
import { FormControl } from '@angular/forms';
import { Validators } from '@angular/forms';
import { PatientService } from '../services/patient-service';
import { SnackService } from '../services/snack.service';
@Component({
    selector: 'app-user-input-dial',
    templateUrl: './user-input-dial.component.html',
    styleUrls: ['./user-input-dial.component.css'],
})
export class UserInputDialComponent {
    complete = true;
    constructor(
        private patientService: PatientService,
        private Snackbar: SnackService,
    ) {}
    registerForm = new FormGroup({
        name: new FormControl('', [Validators.required]),
        surname: new FormControl('', [Validators.required]),
        dob: new FormControl(),
        gender: new FormControl(),
        email: new FormControl('', [Validators.required, Validators.email]),
        phone: new FormControl('', [Validators.required]),
        location: new FormControl(),
    });
    getErrorMessage() {
        if (this.registerForm.hasError('required')) {
            return 'You must enter a value';
        }

        return this.registerForm.hasError('email') ? 'Not a valid email' : '';
    }
    addPatient() {
        const patient = this.registerForm.value;
        console.log('patient form value:', patient);
    }
}
