import { Component, OnInit } from '@angular/core';
import {MatDialog} from '@angular/material';
import {EditPreferencesDialogComponent} from '../edit-preferences-dialog/edit-preferences-dialog.component';
import {Router} from '@angular/router';
import {SubscribeDialogComponent} from '../subscribe-dialog/subscribe-dialog.component';

@Component({
  selector: 'app-contact-form',
  templateUrl: './contact-form.component.html',
  styleUrls: ['./contact-form.component.scss']
})
export class ContactFormComponent implements OnInit {

  constructor(private dialog: MatDialog, private router: Router) { }

  ngOnInit() {
  }

  openDialog() {
    const dialogRef = this.dialog.open(EditPreferencesDialogComponent, {
      width: '350px',
      data: {
      },
      panelClass: 'custom-modalbox',
      autoFocus: false
    });

    dialogRef.afterClosed().subscribe((result: any) => {
      if (result && result.subscriber) {
        this.router.navigate(['/edit_confirmation']);
      }
    });
  }

  openQuincenalDialog() {
    const dialogRef = this.dialog.open(SubscribeDialogComponent, {
      width: '350px',
      data: {
        quincenal: true
      },
      panelClass: 'custom-modalbox',
      autoFocus: false
    });

    dialogRef.afterClosed().subscribe((result: any) => {
      if (result && result.subscriber) {
        this.router.navigate(['/sub2factor_confirmation']);
      }
    });
  }

  tagSuscribe(suscribeText: any){
    window.dataLayer = window.dataLayer || [];
    window.dataLayer.push({'eventCategory': 'Home','eventAction': 'Suscripción','eventLabel': suscribeText,'eventvalue': '','event': 'eventClick'});
  }
}
