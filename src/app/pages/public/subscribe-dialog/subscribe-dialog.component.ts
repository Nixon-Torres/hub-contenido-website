import {Component, Inject} from '@angular/core';
import {MatDialogRef, MAT_DIALOG_DATA, MatDialog} from '@angular/material/dialog';

import {AbstractControl, FormControl, FormGroup, ValidatorFn, Validators} from '@angular/forms';

@Component({
  selector: 'app-subscribe-dialog',
  templateUrl: './subscribe-dialog.component.html',
  styleUrls: ['./subscribe-dialog.component.scss']
})
export class SubscribeDialogComponent {
  public subscribeGroup: FormGroup;
  public subscriber: any = {};

  public title: string;
  public description: string;
  public source: string;

  public options: any = [{
    title: 'Bajo',
    description: 'Desea aprender los conceptos más básicos de economía y finanzas y después profundizar en ellos.',
    code: 'LOW'
  }, {
    title: 'Medio',
    description: 'Le son familiares conceptos básicos de economía y finanzas, pero quiere aprender temas más especializados.',
    code: 'MEDIUM'
  }, {
    title: 'Alto',
    description: 'Utiliza a diario conceptos especializados de economía y finanzas.',
    code: 'HIGH'
  }];

  public currentOption = '';

  constructor(
    public dialogRef: MatDialogRef<SubscribeDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any) {

    this.subscribeGroup = new FormGroup({
      name: new FormControl('', Validators.required),
      lastName: new FormControl('', Validators.required),
      email: new FormControl('', [Validators.required, Validators.email]),
      knowledge: new FormControl('', Validators.required),
      accept: new FormControl(false, [Validators.required, Validators.requiredTrue]),
    });
  }

  public setCurrentOption(evt) {
    const option = this.options.find(e => e.code === evt.value);
    this.currentOption = option ? option.title : '';
  }

  public subscribe() {
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

}
