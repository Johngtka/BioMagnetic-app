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
    constructor(public dialog: MatDialog) {}

    openDialog(patient?: Patient) {
        this.dialog.open(UserInputDialogComponent, {
            data: { patient },
            disableClose: true,
        });
    }
}
