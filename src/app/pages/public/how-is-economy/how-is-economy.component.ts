import { Component, OnInit } from '@angular/core';
import {HttpService} from '../../../services/http.service';

@Component({
  selector: 'app-how-is-economy',
  templateUrl: './how-is-economy.component.html',
  styleUrls: ['./how-is-economy.component.scss']
})
export class HowIsEconomyComponent implements OnInit {
  public tab = 'tab1';
  public reports: any;
  public randomReports: any;
  public headerReport: any;
  public area1Report: any;
  public area2Report: any;
  public area3Report: any;
  public area4Report: any;

  constructor(private http: HttpService) { }

  ngOnInit() {
    this.loadOutstanding();
    this.getRandomReports();
  }

  getCategory(reportType) {
    return reportType && reportType.mainCategory && reportType.mainCategory.length ?
      reportType.mainCategory[0].description : '';
  }

  public getRandomReports() {
    this.http.get({
      path: 'public/reports/',
      data: {
        order: 'publishedAt DESC',
        limit: 8,
        fields: ['id', 'name', 'sectionId', 'reportTypeId', 'publishedAt', 'smartContent'],
        include: [{
          relation: 'reportType',
          scope: {
            include: ['mainCategory', 'subCategory']
          }
        }]
      },
      encode: true
    }).subscribe((response: any) => {
      this.randomReports = response.body;
    }, (error: any) => {
      console.error(error);
    });
  }

  private loadOutstanding() {
    const filter = {
      where: {
        howseconomy: true
      },
      fields: ['id', 'name', 'howseconomyArea', 'sectionId', 'reportTypeId', 'publishedAt', 'smartContent'],
      include: ['files', 'section', {
        relation: 'reportType',
        scope: {
          include: ['mainCategory', 'subCategory']
        }
      }],
      order: 'updatedAt DESC'
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

      this.headerReport = this.reports.find(e => e.howseconomyArea === 'outstanding');
      this.area1Report = this.reports.find(e => e.howseconomyArea === 'report1');
      this.area2Report = this.reports.find(e => e.howseconomyArea === 'report2');
      this.area3Report = this.reports.find(e => e.howseconomyArea === 'report3');
      this.area4Report = this.reports.find(e => e.howseconomyArea === 'report4');
    });
  }
}
