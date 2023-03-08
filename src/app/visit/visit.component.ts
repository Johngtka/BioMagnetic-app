import { Component } from '@angular/core';

import { Patient } from '../models/patient';

@Component({
    selector: 'app-visit',
    templateUrl: './visit.component.html',
    styleUrls: ['./visit.component.css'],
})
export class VisitComponent {
    patient!: Patient;
    ngOnInit(): void {
        this.patient = history.state;
    }
    selectPatient(patientSelected: Patient) {
        this.patient = patientSelected;
    }
}
