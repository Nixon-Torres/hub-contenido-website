import {Component, OnInit} from '@angular/core';
import {HttpService} from '../../../services/http.service';
import {environment} from '../../../../environments/environment';
import {DomSanitizer} from '@angular/platform-browser';
import {Observable} from 'rxjs';
import {map} from 'rxjs/operators';
import {FormArray, FormBuilder, FormControl, FormGroup} from '@angular/forms';
import {SubscribeDialogComponent} from '../subscribe-dialog/subscribe-dialog.component';
import {MatDialog} from '@angular/material';

@Component({
  selector: 'app-preferences',
  templateUrl: './preferences.component.html',
  styleUrls: ['./preferences.component.scss']
})
export class PreferencesComponent implements OnInit {
  public breadcrumbItems: Array<any> = [{
    label: 'Preferencias',
    link: ['/preferences']
  }];

  public STORAGE_URL = environment.URL_API;
  public mainCategories;
  public categories;
  public reportTypes;
  public selectedCategory;
  public selectedIdx;
  public cbs = {
    selectAllCb: false
  };

  public form: FormGroup;

  constructor(private http: HttpService, private sanitizer: DomSanitizer, private fb: FormBuilder, private dialog: MatDialog) {
    this.form = this.fb.group({
      reportTypes: new FormArray([])
    });
  }

  public getPreviousCatName() {
    if (this.selectedIdx < 1) {
      return '';
    }

    const idx = this.selectedIdx - 1;
    return this.categories[idx].description;
  }

  public getNextCatName() {
    if (this.selectedIdx >= (this.mainCategories.length - 1)) {
      return '';
    }

    const idx = this.selectedIdx + 1;
    return this.categories[idx].description;
  }

  private addCheckboxes(reportTypes: Array<any>): void {
    reportTypes.forEach((type) => {
      const control = new FormControl(false);
      (this.form.controls.reportTypes as FormArray).push(control);
    });
  }

  private clearCheckboxes(formArray: FormArray): void {
    while (formArray.length !== 0) {
      formArray.removeAt(0);
    }
  }

  public getTypeIndex(reportType) {
    const type = this.reportTypes.find(e => e.id === reportType.id);
    return this.reportTypes.indexOf(type);
  }

  public getMonthlyReports() {
    const selected = this.getCheckboxesSelected();
    const response = this.reportTypes.filter(e => selected.indexOf(e.id) > -1);

    return response.reduce((a, b) => {
      let monthQty = 0;
      switch (b.period) {
        case 'day':
          monthQty = b.qty * 30;
          break;
        case 'week':
          monthQty = b.qty * 4;
          break;
        case 'quarter':
          monthQty = b.qty * 2;
          break;
        case 'month':
          monthQty = b.qty;
          break;
        default:
          monthQty = 0;
          break;
      }

      a += monthQty;
      return a;
    }, 0);
  }

  public getCheckboxesSelected(): Array<any> {
    const rsp = this.form.value.reportTypes
      .map((v: any, i: number) => v ? this.reportTypes[i] : null)
      .filter((v: any) => v !== null);

    return rsp.map(e => e.id);
  }

  public changeCategory(tab) {
    this.cbs.selectAllCb = false;
    this.selectedCategory = this.categories[tab.index];
    this.selectedIdx = tab.index;
  }

  public nextCategory() {
    this.cbs.selectAllCb = false;
    if (this.selectedIdx >= (this.mainCategories.length - 1)) {
      return;
    }
    this.selectedIdx++;
    this.selectedCategory = this.mainCategories[this.selectedIdx];
  }

  public previousCategory() {
    this.cbs.selectAllCb = false;
    if (this.selectedIdx <= 0) {
      return;
    }
    this.selectedIdx--;
    this.selectedCategory = this.mainCategories[this.selectedIdx];
  }

  public open(categoryId: string): void {
    this.dialog.open(SubscribeDialogComponent, {
      width: '602px',
      data: {
        categoryId
      }
    });
  }

  public unselectReportType(type) {
    const idx = this.getTypeIndex(type);
    (this.form.controls.reportTypes as FormArray).controls[idx].setValue(false);
  }

  public getFreqLabel(period) {
    switch (period) {
      case 'day':
        return 'al día';
      case 'week':
        return 'a la semana';
      case 'quarter':
        return 'quincenales';
      case 'month':
        return 'al mes';
      default:
        return 'unknown';
    }
  }

  public getFreqLabel2(period) {
    switch (period) {
      case 'day':
        return 'Diaria';
      case 'week':
        return 'Semanal';
      case 'quarter':
        return 'Quincenal';
      case 'month':
        return 'Mensual';
      default:
        return 'unknown';
    }
  }

  public getSelectedPerSubCategory(subcategory) {
    const selected = this.getCheckboxesSelected();
    const response = this.reportTypes.filter(e => selected.indexOf(e.id) > -1 && e.subCategory.find(k => k.id === subcategory.id));
    return response;
  }

  public getSelectedCategories() {
    const selected = this.getCheckboxesSelected();
    const response = this.reportTypes.filter(e => selected.indexOf(e.id) > -1);
    const categories = response.reduce((all, type) => {
      const cat = all.find(e => type.category.id === e.id);
      if (!cat) {
        const category = type.category;
        category.reportTypes = [type];
        all.push(category);
      } else {
        cat.reportTypes.push(type);
      }
      return all;
    }, []);
    return categories;
  }

  public toggleSelection() {
    this.selectedCategory.childrenMainReportTypes.forEach(e => {
      const idx = this.getTypeIndex(e);
      (this.form.controls.reportTypes as FormArray).controls[idx].setValue(this.cbs.selectAllCb);
    });
  }

  private getCategories() {
    this.clearCheckboxes(this.form.controls.reportTypes as FormArray);
    return this.http.get({
      path: `public/categories/`,
      data: {
        where: { parentId: null },
        include: ['childrenMainReportTypes', 'childrenSubReportTypes', {
          relation: 'children',
          scope: {
            include: ['childrenMainReportTypes', 'childrenSubReportTypes'],
            order: 'description ASC'
          }
        }]
      },
      encode: true
    }).subscribe((res) => {
      this.categories = res.body;
      this.mainCategories = this.categories.filter(e => !e.parentId);

      this.reportTypes = this.categories.reduce((all, category) => {
        all = all.concat(category.childrenMainReportTypes.map((type) => {
          type.category = category;
          return type;
        }));
        return all;
      }, []);

      this.addCheckboxes(this.reportTypes);
      this.selectedCategory = this.categories[0];
    });
  }

  ngOnInit() {
    this.getCategories();
  }
}
