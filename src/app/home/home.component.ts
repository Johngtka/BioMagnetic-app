import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Patient } from '../models/patient';

import { UserInputDialogComponent } from '../user-input-dialog/user-input-dial.component';

@Component({
    selector: 'app-home',
    templateUrl: './home.component.html',
    styleUrls: ['./home.component.css'],
})
export class HomeComponent {
    newOrUpdatedPatient;
    constructor(private dialog: MatDialog) {}

    openDialog(patient?: Patient) {
        const dialogRef = this.dialog.open(UserInputDialogComponent, {
            data: { patient },
            disableClose: true,
        });
        dialogRef.afterClosed().subscribe((result) => {
            this.newOrUpdatedPatient = result;
        });
    }
}
