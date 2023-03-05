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
        // const dialogRef = this.dialog.open(UserInputDialogComponent);
        // dialogRef.afterClosed().subscribe((result) => {
        //     console.log(`Dialog result: ${result}`);
        // });
        this.dialog.open(UserInputDialogComponent);
    }
}
