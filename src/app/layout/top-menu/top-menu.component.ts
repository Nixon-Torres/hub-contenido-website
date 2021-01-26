import {Component, OnInit} from '@angular/core';
import {HttpService} from '../../services/http.service';
import {map} from 'rxjs/operators';
import {forkJoin, Observable} from 'rxjs';
import {Router} from '@angular/router';
import {GoogleTagManagerService} from 'angular-google-tag-manager';

@Component({
  selector: 'app-top-menu',
  templateUrl: './top-menu.component.html',
  styleUrls: ['./top-menu.component.scss'],
  host: { class: 'top-menu' }
})

export class TopMenuComponent implements OnInit {
  public subMenuVisible = false;
  public currentMenuOption: number;
  public currentCategory: any;
  public currentReport: any;
  public ready = false;

  private menuOptions = [{
    name: 'Estar actualizado',
    code: 'ESTARACTUALIZADO'
  }, {
    name: 'Macroeconomía',
    code: 'MACROECONOMA'
  }, {
    name: 'Nuestros indicadores',
    code: 'NUESTROSINDICADORES'
  }, {
    name: 'Economías Centroamericanas',
    code: 'ECONOMASCENTROAMERICANAS'
  }, {
    name: 'Tendencias sectoriales',
    code: 'TENDENCIASSECTORIALES'
  }, {
    name: 'Análisis de compañias',
    code: 'ANLISISDECOMPAAS'
  }, {
    name: 'En qué invertir',
    code: 'ENQUINVERTIR'
  }, {
    name: 'Multimedia',
    code: 'MULTIMEDIA'
  }];

  readonly  DEFAULT_ITEMS_PER_GROUP = 5;

  public companies: any;
  public categories: any;
  public reports: any;
  public reportTypes: any;

  public totalGroups;
  public itemGroups = [[], [], []];
  public investmentGroups = [{
    name: 'Renta Fija',
    code: 'RENTAFIJA',
    items: [],
    id: null,
  }, {
    name: 'Acciones',
    code: 'ACCIONES',
    items: [],
    id: null,
  }, {
    name: 'Monedas',
    code: 'DIVISAS',
    items: [],
    id: null,
  }];

  public menuTimer: any;
  total: any;

  constructor(private http: HttpService, private router: Router, private gtmService: GoogleTagManagerService) {
    router.events.subscribe((val) => {
      this.mouseLeave();
    });
  }

  ngOnInit() {
    const observables = [this.getCompanies(), this.getCategories(), this.getReportTypes()];
    forkJoin(observables).subscribe(() => {
      this.ready = true;
    });
  }

  go(eventName) {

    const gtmTag = {
      event: eventName,
      clickUrl: window.location.href
    };
    this.gtmService.pushTag(gtmTag);
  }

  mouseEnter(idx?: number) {
    if (!this.ready) {
      return;
    }

    if (this.subMenuVisible) {
      return this.mouseEnterAfterSeconds(idx);
    }

    this.menuTimer = setTimeout(() => {
      this.mouseEnterAfterSeconds(idx);
    }, 500);
  }

  mouseEnterAfterSeconds(idx?: number) {
    if (!this.ready) {
      return;
    }

    this.subMenuVisible = true;

    if (idx !== null) {
      const oldIdx = this.currentMenuOption;
      this.currentMenuOption = idx;

      const code = this.menuOptions[idx - 1].code;
      const category = this.categories.find(e => e.code === code);
      this.currentCategory = category;
      this.currentReport = null;

      if (this.reports) {
        this.currentReport = this.reports.find(e => this.currentCategory.mainReportId &&
          e.id === this.currentCategory.mainReportId);
      }

      if (oldIdx !== this.currentMenuOption) {
        this.distributeItems(false);
      }
    }
  }

  private getItems() {
    if (this.currentMenuOption === 6) {
      return this.companies.sort((a, b) => {
          const nameA = a.name.toLowerCase();
          const nameB = b.name.toLowerCase();
          if (nameA > nameB) {
            return 1;
          } else if (nameA < nameB) {
            return -1;
          } else {
            return 0;
          }
      });
    }

    const code = this.menuOptions[this.currentMenuOption - 1].code;
    const category = this.categories.find(e => e.code === code);
    if (!category) {
      return [];
    }

    const params = this.currentCategory && this.currentCategory.params ? this.currentCategory.params : {};
    const alphabetic = params.sorting && params.sorting === 'alphabetic';
    const reportTypes = this.reportTypes.filter(e => e.mainCategory.find(k => k.id === category.id))
      .map(e => {
        const item = e;
        item.name = item.description;
        return item;
      }).sort((a, b) => {
        if (alphabetic) {
          const nameA = this.getReportTypeName(a).toLowerCase();
          const nameB = this.getReportTypeName(b).toLowerCase();
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
    return reportTypes;
  }

  getReportTypeName(reportType: any) {
    if (reportType && reportType.aliases) {
      const alias = reportType.aliases;
      if (alias[this.currentCategory.id]) {
        return alias[this.currentCategory.id];
      }
    }
    return reportType.name;
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
      path: `public/categories/`
    }).pipe(
      map((res) => {
        this.categories = res.body;
        this.getReports();
        return res;
      })
    );
  }

  public getCategoryName(reportType) {
    const subCategory = reportType.subCategory && reportType.subCategory.length ? reportType.subCategory[0] : null;
    if (subCategory) {
      return subCategory.description;
    }
    const category = reportType.mainCategory && reportType.mainCategory.length ? reportType.mainCategory[0] : null;
    return category ? category.description : '';
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

  private distributeItems(showAll: boolean) {
    const items = this.getItems();
    this.total = items.length;

    this.totalGroups = 2;
    if (this.currentMenuOption === 6 || this.currentMenuOption === 7) {
      this.totalGroups = 3;
    }

    let itemsPerGroup = Math.ceil(this.total / this.totalGroups);
    itemsPerGroup = !showAll ? Math.min(this.DEFAULT_ITEMS_PER_GROUP, this.total) : itemsPerGroup;

    this.itemGroups = this.itemGroups.map(e => []);

    let idx = 0;
    let cnt = 0;

    if (this.currentMenuOption === 7) {
      this.investmentGroups = this.investmentGroups.map(e => {
        const subitems = items.filter(k => k.subCategory.find(x => x.code === e.code));
        e.items = subitems;
        e.id = subitems ? subitems[0].subCategory[0].id : '';
        return e;
      });
      return;
    }

    while (idx < this.totalGroups) {
      while (this.itemGroups[idx].length < itemsPerGroup && cnt < items.length) {
        this.itemGroups[idx].push(items[cnt]);
        cnt++;
      }
      idx++;
    }
  }

  mouseLeave() {
    this.subMenuVisible = false;

    if (this.menuTimer) {
      window.clearTimeout(this.menuTimer);
    }
  }

  getCategoryId(option?: number) {
    const idx = option ? option : this.currentMenuOption;
    if (!this.categories) {
      return null;
    }
    const cat = this.categories.find(e => e.code === this.menuOptions[idx - 1].code);
    return cat ? cat.id : null;
  }

  getCategoryLink(option?: number) {
    const id = this.getCategoryId(option);
    if (id !== null) {
      return ['/categories', id];
    }

    return ['/categories', option];
  }

  getQueryParams(gp) {
    return {subcategory: gp.id};
  }

  getCategoryReportTypeLink(report: any) {
    const id = this.getCategoryId();

    if (report && report.code === 'ELLIBRO') {
      return ['/book'];
    }

    const rsp = ['/categories', id, 'type', report.id];
    return rsp;
  }
}
