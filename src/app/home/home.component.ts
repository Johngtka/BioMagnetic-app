import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';

import { UserInputDialogComponent } from '../user-input-dialog/user-input-dial.component';

@Component({
    selector: 'app-home',
    templateUrl: './home.component.html',
    styleUrls: ['./home.component.css'],
})
export class HomeComponent {
    constructor(public dialog: MatDialog) {}

    openDialog() {
        this.dialog.open(UserInputDialogComponent, { disableClose: true });
    }
}
