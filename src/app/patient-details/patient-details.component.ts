import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { Patient } from '../models/patient';
import { NavigationObject } from '../models/NavigationObject';
@Component({
    selector: 'app-patient-details',
    templateUrl: './patient-details.component.html',
    styleUrls: ['./patient-details.component.css'],
})
export class PatientDetailsComponent implements OnInit {
    constructor(private router: Router) {}

    patient: Patient;
    ngOnInit(): void {
        this.patient = {} as Patient;
        const urlPatient = history.state;
        if (this.checkIfPatient(urlPatient)) {
            this.patient = urlPatient;
        }
    }
    openVisit() {
        this.router.navigate(['visit'], {
            state: this.patient,
        });
    }
    private checkIfPatient(
        object: Patient | NavigationObject,
    ): object is Patient {
        return Object.hasOwn(object, 'name');
    }
}
