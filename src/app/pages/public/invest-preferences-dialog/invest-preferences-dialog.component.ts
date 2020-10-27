import {Component, Inject} from '@angular/core';
import {MatDialogRef, MAT_DIALOG_DATA, MatDialog} from '@angular/material/dialog';

import {AbstractControl, FormControl, FormGroup, ValidatorFn, Validators} from '@angular/forms';
import {HttpService} from '../../../services/http.service';
import {DataService} from '../../../data.service';
import {GoogleTagManagerService} from 'angular-google-tag-manager';

@Component({
  selector: 'app-invest-preferences-dialog',
  templateUrl: './invest-preferences-dialog.component.html',
  styleUrls: ['./invest-preferences-dialog.component.scss']
})
export class InvestPreferencesDialogComponent {
  public subscribeGroup: FormGroup;
  public subscriber: any = {};

  public title: string;
  public description: string;
  public source: string;

  public reportTypes: any;
  public category: any;

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
    private http: HttpService,
    private dataService: DataService,
    public dialogRef: MatDialogRef<InvestPreferencesDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private gtmService: GoogleTagManagerService) {

    this.reportTypes = data.reportTypes;
    this.category = data.category;

    this.subscribeGroup = new FormGroup({});
  }

  public getFreqLabel2(type) {
    if (!type) {
      return '';
    }

    if (type && type.periodText) {
      return type.periodText;
    }

    if (type && !type.period) {
      return '';
    }

    switch (type.period) {
      case 'day':
        return 'Diaria';
      case 'week':
        return 'Semanal';
      case 'quarter':
        return 'Quincenal';
      case 'month':
        return 'Mensual';
      case 'year':
        return 'Anual';
      default:
        return 'unknown';
    }
  }

  public process() {
    this.dialogRef.close({reportTypes: this.reportTypes});
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  tag(eventCategory, eventAction, eventLabel) {

    const gtmTag = {
      eventCategory: eventCategory,
      eventAction: eventAction,
      eventLabel: 'Quitar informes - ' + this.category.description + ' - ' + eventLabel,
      eventvalue: '',
      event: 'eventClick'
    };
    this.gtmService.pushTag(gtmTag);
  }
}
