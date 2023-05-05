import { Component, Inject } from '@angular/core';

import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

import { ConfirmationDialog } from '../models/confirmation-dialog';

export enum ConfirmationDialogResponse {
    OK,
}

@Component({
    selector: 'app-confirmation-dialog',
    templateUrl: './confirmation-dialog.component.html',
    styleUrls: ['./confirmation-dialog.component.css'],
})
export class ConfirmationDialogComponent {
    constructor(
        public dialogRef: MatDialogRef<ConfirmationDialogComponent>,
        @Inject(MAT_DIALOG_DATA) public data: ConfirmationDialog,
    ) {}

    confirm() {
        this.dialogRef.close(ConfirmationDialogResponse.OK);
    }
}
