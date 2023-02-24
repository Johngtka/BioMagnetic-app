import { Component } from '@angular/core';

import { MatDialog } from '@angular/material/dialog';
import { UserInputDialComponent } from '../user-input-dial/user-input-dial.component';
import { PatientService } from '../services/patient-service';
import { SnackService } from '../services/snack.service';
@Component({
    selector: 'app-home',
    templateUrl: './home.component.html',
    styleUrls: ['./home.component.css'],
})
export class HomeComponent {
    constructor(
        public dialog: MatDialog,
        private patientService: PatientService,
        private snack: SnackService,
    ) {}

    openDialog() {
        const dialogRef = this.dialog.open(UserInputDialComponent);
        dialogRef.afterClosed().subscribe((result) => {
            console.log(`Dialog result: ${result}`);
        });
    }
}
