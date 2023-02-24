import { Component } from '@angular/core';

import { MatDialog } from '@angular/material/dialog';
import { UserInputDialComponent } from '../user-input-dial/user-input-dial.component';
@Component({
    selector: 'app-home',
    templateUrl: './home.component.html',
    styleUrls: ['./home.component.css'],
})
export class HomeComponent {
    constructor(public dialog: MatDialog) {}

    openDialog() {
        const dialogRef = this.dialog.open(UserInputDialComponent);
        dialogRef.afterClosed().subscribe((result) => {
            console.log(`Dialog result: ${result}`);
        });
    }
}
