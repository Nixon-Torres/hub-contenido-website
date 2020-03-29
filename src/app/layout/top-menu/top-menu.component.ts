import {Component, OnInit} from '@angular/core';
import {HttpService} from '../../services/http.service';
import {map} from 'rxjs/operators';
import {forkJoin, Observable} from 'rxjs';

@Component({
  selector: 'app-top-menu',
  templateUrl: './top-menu.component.html',
  styleUrls: ['./top-menu.component.scss']
})

export class TopMenuComponent implements OnInit {
  public subMenuVisible = false;
  public currentMenuOption: number;
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

  readonly  DEFAULT_ITEMS_PER_GROUP = 7;

  public companies: any;
  public categories: any;
  public reportTypes: any;

  public totalGroups;
  public itemGroups = [[], [], []];
  public investmentGroups = [{
    name: 'Renta Fija',
    code: 'RENTAFIJA',
    items: []
  }, {
    name: 'Acciones',
    code: 'ACCIONES',
    items: []
  }, {
    name: 'Divisas',
    code: 'DIVISAS',
    items: []
  }];

  constructor(private http: HttpService) {
  }

  ngOnInit() {
    const observables = [this.getCompanies(), this.getCategories(), this.getReportTypes()];
    forkJoin(observables).subscribe(() => {
      this.ready = true;
    });
  }

  mouseEnter(idx?: number) {
    if (!this.ready) {
      return;
    }

    this.subMenuVisible = true;

    if (idx !== null) {
      const oldIdx = this.currentMenuOption;
      this.currentMenuOption = idx;
      if (oldIdx !== this.currentMenuOption) {
        this.distributeItems(false);
      }
    }
  }

  private getItems() {
    if (this.currentMenuOption === 6) {
      return this.companies;
    }

    const code = this.menuOptions[this.currentMenuOption - 1].code;
    const category = this.categories.find(e => e.code === code);
    if (!category) {
      return [];
    }

    const reportTypes = this.reportTypes.filter(e => e.mainCategory.find(k => k.id === category.id))
      .map(e => {
        const item = e;
        item.name = item.description;
        return item;
      });
    return reportTypes;
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
        return res;
      })
    );
  }

  private getCompanies(): Observable<any> {
    return this.http.get({
      path: `public/companies/`
    }).pipe(
      map((res) => {
        this.companies = res.body;
        return res;
      })
    );
  }

  private distributeItems(showAll: boolean) {
    const items = this.getItems();
    const total = items.length;

    this.totalGroups = 2;
    if (this.currentMenuOption === 6 || this.currentMenuOption === 7) {
      this.totalGroups = 3;
    }
    let itemsPerGroup = Math.ceil(total / this.totalGroups);
    itemsPerGroup = !showAll ? Math.min(this.DEFAULT_ITEMS_PER_GROUP, itemsPerGroup) : itemsPerGroup;

    this.itemGroups = this.itemGroups.map(e => []);

    let idx = 0;
    let cnt = 0;

    if (this.currentMenuOption === 7) {
      this.investmentGroups = this.investmentGroups.map(e => {
        const subitems = items.filter(k => k.subCategory.find(x => x.code === e.code));
        e.items = subitems;
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
  }
}
