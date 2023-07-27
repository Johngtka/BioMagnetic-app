import { Component } from '@angular/core';
import { Router } from '@angular/router';

import { MatDialog } from '@angular/material/dialog';

import { Patient } from '../models/patient';
import { UserInputDialogComponent } from '../user-input-dialog/user-input-dial.component';

@Component({
    selector: 'app-home',
    templateUrl: './home.component.html',
    styleUrls: ['./home.component.css'],
})
export class HomeComponent {
    constructor(
        private dialog: MatDialog,
        private route: Router,
    ) {}

    newOrUpdatedPatient;

    openDialog(patient?: Patient) {
        const dialogRef = this.dialog.open(UserInputDialogComponent, {
            data: { patient },
            disableClose: true,
        });
        dialogRef.afterClosed().subscribe((result: Patient) => {
            if (result) {
                this.newOrUpdatedPatient = result;
            }
        });
    }
    openDetailsBySearched(patient: Patient) {
        this.route.navigate(['patient/details'], {
            state: patient,
        });
    }
}
