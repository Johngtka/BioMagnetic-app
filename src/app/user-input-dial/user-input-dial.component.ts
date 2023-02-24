import { Component } from '@angular/core';

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
    ddd = (this.complete = false);
}
