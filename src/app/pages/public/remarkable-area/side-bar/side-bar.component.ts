import { Component, OnInit } from '@angular/core';
import {HttpService} from '../../../../services/http.service';
import {environment} from '../../../../../environments/environment';

@Component({
  selector: 'app-side-bar',
  templateUrl: './side-bar.component.html',
  styleUrls: ['./side-bar.component.scss']
})
export class SideBarComponent implements OnInit {

  public STORAGE_URL = environment.URL_API;
  public dailyReport: any;
  public reports: any;
  public contents: any;
  public selectedTab = 'tab1';

  public banner1: any;
  public banner2: any;

  constructor(private http: HttpService) { }

  ngOnInit() {
    this.loadReports(1);
    this.loadContents();
    this.getDailyType();
  }

  getCategory(reportType) {
    return reportType && reportType.mainCategory && reportType.mainCategory.length ?
      reportType.mainCategory[0].description : '';
  }

  getDailyType() {
    const code = 'DIARIOACCIONES';

    this.http.get({
      path: `public/reports_type/`,
      data: {
        where: {
          code
        }
      },
      encode: true
    }).subscribe((res) => {
      const data = res.body as any;
      if (data.length) {
        this.getDailyReport(data[0].id);
      }
    });
  }

  getDailyReport(reportTypeId: string) {
    this.http.get({
      path: `public/reports/`,
      data: {
        where: {
          reportTypeId
        },
        order: 'publishedAt DESC',
        limit: 1
      },
      encode: true
    }).subscribe((res) => {
      const data = res.body as any;
      if (data.length) {
        this.dailyReport = data[0];
      }
    });
  }

  changeTab(idx) {
    this.selectedTab = `tab${idx}`;
    this.loadReports(idx);
  }

  private loadReports(idx) {
    const filter = {
      where: {
      },
      fields: ['id', 'name', 'sectionId', 'reportTypeId', 'publishedAt', 'smartContent'],
      include: ['files', 'section', {
        relation: 'reportType',
        scope: {
          include: ['mainCategory', 'subCategory']
        }
      }],
      order: idx === 1 ? 'publishedAt DESC' : 'reads DESC',
      limit: 6
    };
    this.http.get({
      path: `public/reports/`,
      data: filter,
      encode: true
    }).subscribe((res) => {
      this.reports = res.body;

      this.reports = this.reports
          .map(e => {
            if (e.section && e.section.types && e.section.types.length) {
              e.type = e.section.types.find(k => k.key === e.sectionTypeKey);
            } else {
              e.type = null;
            }
            return e;
          });
    });
  }

  private loadContents() {
    const filter = {
      where: {
        or: [
          {key: 'banner_1'},
          {key: 'banner_2'}
        ]
      },
      include: ['files']
    };
    this.http.get({
      path: `public/contents/`,
      data: filter,
      encode: true
    }).subscribe((res) => {
      this.contents = res.body;

      this.banner1 = this.contents.find(e => e.key === 'banner_1');
      this.banner2 = this.contents.find(e => e.key === 'banner_2');
    });
  }
}
