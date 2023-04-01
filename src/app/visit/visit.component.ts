import { Component } from '@angular/core';

import { Patient } from '../models/patient';
import { StoreService } from '../services/store.service';
@Component({
    selector: 'app-visit',
    templateUrl: './visit.component.html',
    styleUrls: ['./visit.component.css'],
})
export class VisitComponent {
    constructor(private storeService: StoreService) {}
    patient!: Patient;
    ngOnInit(): void {
        this.patient = history.state;
    }
    selectPatient(patientSelected: Patient) {
        this.patient = patientSelected;
        this.storeService.getStore().subscribe({
            // next: () => (
            // ),
            // error: () => {
            // },
        });
    }
}
