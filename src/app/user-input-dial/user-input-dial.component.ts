import { Patient } from './../models/patient';
import { Component } from '@angular/core';

// import { Patient } from '../models/patient';
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
    patientData!: Patient[];
    getErrorMessage() {
        if (this.registerForm.hasError('required')) {
            return 'You must enter a value';
        }
        return this.registerForm.hasError('email') ? 'Not a valid email' : '';
    }
    addPatient() {
        const patient = this.registerForm.value;
        // const tab = [patient.name, patient.surname, patient.phone];
        // if (tab) {
        //     this.patientService.createPatient(patient);
        // } else {
        //     console.log('sss');
        // }
        console.log('patient form value:', patient);
    }
}
