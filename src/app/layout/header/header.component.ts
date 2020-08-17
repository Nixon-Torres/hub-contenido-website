import { Component, OnInit } from '@angular/core';
import { HttpService } from '../../services/http.service';
import { Router } from '@angular/router';
import { GoogleTagManagerService } from 'angular-google-tag-manager';
import { EditPreferencesDialogComponent } from '../../pages/public/edit-preferences-dialog/edit-preferences-dialog.component';
import { SubscribeDialogComponent } from '../../pages/public/subscribe-dialog/subscribe-dialog.component';
import { MatDialog } from '@angular/material';
import { map } from 'rxjs/operators';
import { forkJoin, Observable } from 'rxjs';
@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {
  public reportsList: Array<any>;
  public searchText: string;
  public subscribeMenuVisible = false;
  public currentMenuOption: number;
  public categories: any;
  public mainCategories: any;
  public reports: any;
  public reportTypes: any;
  public ready = false;
  public companies: any;
  public currentCategory: any;
  private menuOptions = [{
    name: 'Estar actualizado',
    code: 'ESTARACTUALIZADO',
    idx: 1,
  }, {
    name: 'Macroeconomía',
    code: 'MACROECONOMA',
    idx: 2,
  }, {
    name: 'Nuestros indicadores',
    code: 'NUESTROSINDICADORES',
    idx: 3,
  }, {
    name: 'Economías Centroamericanas',
    code: 'ECONOMASCENTROAMERICANAS',
    idx: 4,
  }, {
    name: 'Tendencias sectoriales',
    code: 'TENDENCIASSECTORIALES',
    idx: 5,
  }, {
    name: 'Análisis de compañias',
    code: 'ANLISISDECOMPAAS',
    idx: 6,
  }, {
    name: 'En qué invertir',
    code: 'ENQUINVERTIR',
    idx: 7,
  }];
  public investmentGroups = [{
    name: 'Renta Fija',
    code: 'RENTAFIJA',
    items: []
  }, {
    name: 'Acciones',
    code: 'ACCIONES',
    items: []
  }, {
    name: 'Monedas',
    code: 'DIVISAS',
    items: []
  }];
  items: any;
  constructor(
    private dialog: MatDialog,
    private http: HttpService,
    private router: Router,
    private gtmService: GoogleTagManagerService
  ) {
  }

  ngOnInit() {
    const observables = [this.getCompanies(), this.getCategories()];
    forkJoin(observables).subscribe(() => {
      this.ready = true;
    });
  }

  private getItems(menu) {
    if (menu.code === 'ANLISISDECOMPAAS') {
      return this.companies;
    }

    if (!this.categories) {
      return;
    }

    const code = menu.code;
    debugger
    const category = this.categories.find(e => e.code === code);
    if (!category) {
      return [];
    }

    return category.childrenMainReportTypes.length ? category.childrenMainReportTypes : category.childrenSubReportTypes;
  }

  mouseEnter(idx?: number) {
    if (!this.ready) {
      return;
    }
  }

  go(eventName) {
    const gtmTag = {
      event: eventName,
      clickUrl: window.location.href
    };
    this.gtmService.pushTag(gtmTag);
  }

  getCategoryReportTypeLink(report: any) {
    const id = this.getCategoryId();

    if (report && report.code === 'ELLIBRO') {
      return this.router.navigate(['/book']);
    } else {
      this.router.navigate(['/categories', id, 'type', report && report.id ? report.id : '']);
    }
    document.getElementById('mySidenav').style.width = '0';
  }

  getReportTypeName(reportType: any, category: any) {
    if (reportType && reportType.aliases) {
      const alias = reportType.aliases;
      if (alias[category.id]) {
        return alias[category.id];
      }
    }
    return reportType.description;
  }

  getCategoryLink(option?: number) {
    const id = this.getCategoryId(option);
    if (id !== null) {
      return ['/categories', id];
    }

    return ['/categories', option];
  }

  getCategoryId(option?: number) {
    const idx = option ? option : this.currentMenuOption;
    if (!this.categories) {
      return null;
    }
    const cat = this.categories.find(e => e.code === this.menuOptions[idx - 1].code);
    return cat ? cat.id : null;
  }

  private getReportTypes(): Observable<any> {
    return this.http.get({
      path: `public/reports_type/`,
      data: {
        include: ['mainCategory', 'subCategory']
      },
      encode: true
    }).pipe(
      map((res) => {
        this.reportTypes = res.body;
        return res;
      })
    );
  }

  private getCategories(): Observable<any> {
    return this.http.get({
      path: `public/categories/`,
      data: {
        where: {},
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
    }).pipe(
      map((res) => {
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

          category.childrenSubReportTypes = category.childrenSubReportTypes.map((reportType) => {
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
        return res;
      })
    );
  }

  private getCompanies(): Observable<any> {
    return this.http.get({
      path: `public/companies/`,
      data: {
        order: 'name ASC'
      },
      encode: true,
    }).pipe(
      map((res) => {
        this.companies = res.body;
        return res;
      })
    );
  }

  private getReports() {
    this.http.get({
      path: `public/reports/`,
      data: {
        where: {
          id: {
            inq: this.categories.filter(e => e.mainReportId).map(e => e.mainReportId)
          }
        },
        fields: ['id', 'name', 'smartContent', 'rTitle', 'reportTypeId', 'publishedAt'],
        include: [{
          relation: 'reportType',
          scope: {
            include: ['mainCategory', 'subCategory']
          }
        }]
      },
      encode: true
    }).subscribe((res) => {
      this.reports = res.body;
    });
  }

  onLoadReports() {
    this.http.get({
      path: 'public/reports',
      data: {
        include: ['user', 'reportType', {
          relation: 'reportType',
          scope: {
            include: ['mainCategory', 'subCategory']
          }
        }],
        where: {
          stateId: '5e068c81d811c55eb40d14d0'
        }
      },
      encode: true
    }).subscribe((resp: any) => {
      this.reportsList = resp.body;
      this.onLoadMultimedia(this.reportsList);
    });
  }

  onLoadMultimedia(list) {
    this.http.get({
      path: 'public/contents',
      data: {
        include: ['lastUpdater'],
        where: {
          key: 'multimedia'
        }
      },
      encode: true
    }).subscribe((resp: any) => {

    });
  }

  redirectSelection(event) {
    const location = event.multimediaType ? '/multimedia' : '/reports';
    if (event && event.id) {
      this.router.navigate([location, event.id]);
    }
  }

  customSearchFn(term: string, item: any) {
    term = term.toLowerCase();
    const publishedDate = new Date(item.publishedAt);
    const dateString = `${publishedDate.getDate()}/${publishedDate.getMonth() + 1}/${publishedDate.getFullYear()}`;
    const name = item.name ? 'name' : 'title';
    const author = item.name ? 'user' : 'lastUpdater';
    return item[name].toLowerCase().indexOf(term) > -1 ||
      item[author].name.toLowerCase().indexOf(term) > -1 ||
      dateString.indexOf(term) > -1 ||
      item.reportType.mainCategory.find(e => e.description.toLowerCase().indexOf(term) > -1);
  }

  searchEvent() {
    this.router.navigate(['/search'], {queryParams: {s: this.searchText}});
    document.getElementById('mySidenav').style.width = '0';
  }

  openDialog() {
    const dialogRef = this.dialog.open(EditPreferencesDialogComponent, {
      width: '350px',
      data: {},
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
}
