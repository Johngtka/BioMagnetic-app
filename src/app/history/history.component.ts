import { Component, OnInit } from '@angular/core';

import { Patient } from '../models/patient';
import { NavigationObject } from '../models/NavigationObject';
@Component({
    selector: 'app-history',
    templateUrl: './history.component.html',
    styleUrls: ['./history.component.css'],
})
export class HistoryComponent implements OnInit {
    patient: Patient;
    ngOnInit(): void {
        this.patient = {} as Patient;
        const urlPatient = history.state;
        if (this.checkIfPatient(urlPatient)) {
            this.patient = urlPatient;
        }
    }
    selectPatient(patientSelected: Patient): void {
        this.patient = patientSelected;
    }
    private checkIfPatient(
        object: Patient | NavigationObject,
    ): object is Patient {
        return Object.hasOwn(object, 'name');
    }
}
