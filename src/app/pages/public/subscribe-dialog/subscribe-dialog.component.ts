import {Component, Inject} from '@angular/core';
import {MatDialogRef, MAT_DIALOG_DATA, MatDialog} from '@angular/material/dialog';

import {AbstractControl, FormControl, FormGroup, ValidatorFn, Validators} from '@angular/forms';

@Component({
    selector: 'app-subscribe-dialog',
    templateUrl: './subscribe-dialog.component.html',
    styleUrls: ['./subscribe-dialog.component.scss']
})
export class SubscribeDialogComponent {
    public AddWordGroup: FormGroup;
    public titleInput: FormControl;

    public title: string;
    public description: string;
    public source: string;

    constructor(
        public dialogRef: MatDialogRef<SubscribeDialogComponent>,
        public dialog: MatDialog,
        @Inject(MAT_DIALOG_DATA) public data: any
    ) {
    }
}
