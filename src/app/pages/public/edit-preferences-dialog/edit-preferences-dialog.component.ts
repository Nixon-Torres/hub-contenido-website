import {Component, Inject} from '@angular/core';
import {MatDialogRef, MAT_DIALOG_DATA, MatDialog} from '@angular/material/dialog';

import {AbstractControl, FormControl, FormGroup, ValidatorFn, Validators} from '@angular/forms';
import {HttpService} from '../../../services/http.service';

@Component({
  selector: 'app-edit-preferences-dialog',
  templateUrl: './edit-preferences-dialog.component.html',
  styleUrls: ['./edit-preferences-dialog.component.scss']
})
export class EditPreferencesDialogComponent {
  public subscribeGroup: FormGroup;
  public subscriber: any = {};

  public title: string;
  public description: string;
  public source: string;
  public subscriberNotFound = false;

  constructor(
    private http: HttpService,
    public dialogRef: MatDialogRef<EditPreferencesDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any) {

    this.subscribeGroup = new FormGroup({
      email: new FormControl('', [Validators.required, Validators.email])
    });
  }

  public subscribe() {
    this.subscriberNotFound = false;
    this.http.post({
      path: 'public/subscribe/edit',
      data: {
        subscriber: {
          email: this.subscriber.email
        }
      }
    }).subscribe((res) => {
      this.dialogRef.close({subscriber: this.subscriber});
    }, () => {
      this.subscriberNotFound = true;
    });
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  tagValidateEmail(){
    window.dataLayer = window.dataLayer || [];
    window.dataLayer.push({'eventCategory': 'Actualizar mis preferencias','eventAction': 'Envíar','eventLabel': 'Confirmación correo','eventvalue': '','event': 'eventClick'});
  }
}
