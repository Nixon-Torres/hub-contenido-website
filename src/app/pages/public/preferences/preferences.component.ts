import {Component, OnInit, ViewEncapsulation} from '@angular/core';
import {HttpService} from '../../../services/http.service';
import {environment} from '../../../../environments/environment';
import {DomSanitizer} from '@angular/platform-browser';
import {FormArray, FormBuilder, FormControl, FormGroup} from '@angular/forms';
import {SubscribeDialogComponent} from '../subscribe-dialog/subscribe-dialog.component';
import {MatDialog} from '@angular/material';
import {ActivatedRoute, Router} from '@angular/router';
import {DataService} from '../../../data.service';
import {InvestPreferencesDialogComponent} from '../invest-preferences-dialog/invest-preferences-dialog.component';

@Component({
  selector: 'app-preferences',
  templateUrl: './preferences.component.html',
  styleUrls: ['./preferences.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class PreferencesComponent implements OnInit {
  public breadcrumbItems: Array<any> = [{
    label: 'Preferencias',
    link: ['/preferences']
  }];

  private accessToken: string;
  public subscriptions: any;

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
  public form2: FormGroup;

  public subcategoryCbs = {};

  constructor(private http: HttpService, private sanitizer: DomSanitizer, private fb: FormBuilder, private dialog: MatDialog,
              private router: Router, private dataService: DataService, private activatedRoute: ActivatedRoute) {
    this.form = this.fb.group({
      reportTypes: new FormArray([])
    });
    this.form2 = this.fb.group({
      categories: new FormArray([])
    });
  }

  public toggleSubcategory(id) {
    const addRemove = this.subcategoryCbs[id];

    this.selectedCategory.childrenMainReportTypes.filter(e => e.subCategory.find(j => j.id === id)).forEach(e => {
      const idx = this.getTypeIndex(e);
      (this.form.controls.reportTypes as FormArray).controls[idx].setValue(addRemove);
    });
  }

  public openInvestDialog(event, category) {
    event.preventDefault();
    const selected = this.getCheckboxesSelected();

    const types = category.childrenSubReportTypes.map(e => {
      e.selected = selected.indexOf(e.id) > -1;
      return e;
    });
    const dialogRef = this.dialog.open(InvestPreferencesDialogComponent, {
      width: '600px',
      data: {
        category: category,
        reportTypes: types
      },
      panelClass: 'custom-modalbox',
      autoFocus: false
    });

    dialogRef.afterClosed().subscribe((result: any) => {
      if (!result.reportTypes) {
        return;
      }
      result.reportTypes.forEach(e => {
        const idx = this.getTypeIndex(e);
        (this.form.controls.reportTypes as FormArray).controls[idx].setValue(e.selected);
      });
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

  public editPreferences() {
    const selected = this.getCheckboxesSelected();
    const reportTypes = this.reportTypes.filter(e => selected.indexOf(e.id) > -1);
    this.dataService.subscriptionData = {
      subscriptions: reportTypes
    };

    this.http.put({
      path: 'public/subscriptions?access_token=' + this.accessToken,
      data: {
        subscriptions: selected.map(e => {
          return {
            type: 'REPORTTYPE',
            reportTypeId: e
          };
        })
      },
      encode: true
    }).subscribe((res) => {
      this.router.navigate(['edit_completed_confirmation']);
    });
  }

  public openSubscriptionModal(): void {
    if (this.accessToken) {
      return this.editPreferences();
    }

    const dialogRef = this.dialog.open(SubscribeDialogComponent, {
      width: '350px',
      data: {
      },
      panelClass: 'custom-modalbox',
      autoFocus: false
    });

    dialogRef.afterClosed().subscribe((result: any) => {
      const selected = this.getCheckboxesSelected();
      const reportTypes = this.reportTypes.filter(e => selected.indexOf(e.id) > -1);
      result.subscriptions = reportTypes;
      this.dataService.subscriptionData = result;

      this.http.post({
        path: 'public/subscribe',
        data: {
          subscriber: result.subscriber,
          subscriptions: selected.map(e => {
            return {
              type: 'REPORTTYPE',
              reportTypeId: e
            };
          })
        },
        encode: true
      }).subscribe((res) => {
        this.router.navigate(['sub2factor_confirmation']);
      });
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
      case 'year':
        return 'al año';
      default:
        return 'unknown';
    }
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

  private getSubscriptions() {
    if (!this.accessToken) {
      return;
    }
    this.http.get({
      path: 'public/subscriptions?access_token=' + this.accessToken
    }).subscribe((res) => {
      this.subscriptions = (res.body as any).data;
      this.subscriptions.map(e => {
        return {
          id: e.reportTypeId
        };
      }).forEach(e => {
        const idx = this.getTypeIndex(e);
        (this.form.controls.reportTypes as FormArray).controls[idx].setValue(true);
      });
    });
  }

  private getCategories() {
    this.clearCheckboxes(this.form.controls.reportTypes as FormArray);
    return this.http.get({
      path: `public/categories/`,
      data: {
        where: { parentId: null },
        include: [{
          relation: 'childrenMainReportTypes',
          scope: {
            include: [
              'subCategory'
            ]
          }
        }, 'childrenSubReportTypes', {
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
      this.categories = this.categories.map((category) => {
        const params = category && category.params ? category.params : {};
        const alphabetic = params.sorting && params.sorting === 'alphabetic';
        category.childrenMainReportTypes = category.childrenMainReportTypes.map((reportType) => {
          const desc = this.getReportTypeName(reportType, category);
          reportType.description = desc;
          return reportType;
        }).sort((a, b) => {
          if (alphabetic) {
            const nameA = a.description.toLowerCase();
            const nameB = b.description.toLowerCase();
            if (nameA > nameB) {
              return 1;
            } else if (nameA < nameB) {
              return -1;
            } else {
              return 0;
            }
          } else {
            if (a.order > b.order) {
              return 1;
            } else if (a.order < b.order) {
              return -1;
            } else {
              return 0;
            }
          }
        });
        return category;
      });
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

      const enqueinvertirCat = this.categories.find(e => e.code === 'ENQUINVERTIR');

      enqueinvertirCat.children.forEach(e => {
          const control = new FormControl(false);
          (this.form2.controls.categories as FormArray).push(control);
      });

      this.getSubscriptions();
    });
  }

  getReportTypeName(reportType: any, currentCategory: any) {
    if (reportType && reportType.aliases) {
      const alias = reportType.aliases;
      if (alias[currentCategory.id]) {
        return alias[currentCategory.id];
      }
    }
    return reportType.description;
  }

  ngOnInit() {
    this.getCategories();

    this.activatedRoute.queryParams.subscribe((params: any) => {
      if (params.access_token) {
        this.accessToken = params.access_token;
      }
    });
  }
}
