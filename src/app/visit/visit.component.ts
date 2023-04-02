import { Component } from '@angular/core';

import { Patient } from '../models/patient';
// import { Store } from '../models/store';
import { StoreService } from '../services/store.service';
import { SnackService, SNACK_TYPE } from '../services/snack.service';
@Component({
    selector: 'app-visit',
    templateUrl: './visit.component.html',
    styleUrls: ['./visit.component.css'],
})
export class VisitComponent {
    constructor(
        private storeService: StoreService,
        private snacService: SnackService,
    ) {}
    patient!: Patient;
    store;
    ngOnInit(): void {
        this.patient = history.state;
    }
    selectPatient(patientSelected: Patient) {
        this.patient = patientSelected;
        this.storeService.getStore().subscribe({
            next: (data) => (this.store = data),
            error: (err) => {
                this.snacService.showSnackBarMessage(
                    'ERROR.PATIENT_VISIT_CREATE_PATIENT',
                    SNACK_TYPE.error,
                );
                console.log(err.message);
            },
        });
    }
}
