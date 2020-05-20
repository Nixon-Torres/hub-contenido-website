import { Component, OnInit } from '@angular/core';
import {HttpService} from '../../../services/http.service';

@Component({
  selector: 'app-report-summary',
  templateUrl: './report-summary.component.html',
  styleUrls: ['./report-summary.component.scss']
})
export class ReportSummaryComponent implements OnInit {
  public tab = 'tab1';
  public reports: any;
  public divisasReports: any = [];
  public rentaReports: any = [];
  public headerReport: any;
  public area1Report: any;
  public area2Report: any;
  public area3Report: any;
  public area4Report: any;

  constructor(private http: HttpService) { }

  ngOnInit() {
    this.loadOutstanding();
    this.loadReportTypes();
  }

  getCategory(reportType) {
    return reportType ? reportType.description : '';
    /* return reportType && reportType.mainCategory && reportType.mainCategory.length ?
      reportType.mainCategory[0].description : ''; */
  }

  private loadReportTypes() {
    const filter = {
      where: {
        code: {inq: ['RENTAFIJA', 'DIVISAS']}
      },
      include: ['childrenSubReportTypes'],
      order: 'updatedAt DESC',
      limit: 8
    };
    this.http.get({
      path: `public/categories/`,
      data: filter,
      encode: true
    }).subscribe((res) => {
      const data = res.body as any;
      const divisas = data.find(e => e.code === 'DIVISAS');
      const renta = data.find(e => e.code === 'RENTAFIJA');

      if (divisas && divisas.childrenSubReportTypes && divisas.childrenSubReportTypes.length) {
        const ids = divisas.childrenSubReportTypes.map(e => e.id);
        this.loadDivisasReports(ids);
      }

      if (renta && renta.childrenSubReportTypes && renta.childrenSubReportTypes.length) {
        const ids = renta.childrenSubReportTypes.map(e => e.id);
        this.loadRentaReports(ids);
      }
    });
  }

  private loadDivisasReports(reportTypeIds) {
    const filter = {
      where: {
        reportTypeId: {inq: reportTypeIds}
      },
      fields: ['id', 'name', 'strategyArea', 'sectionId', 'reportTypeId', 'updatedAt', 'smartContent', 'rTitle'],
      include: [{
        relation: 'reportType',
        scope: {
          include: ['mainCategory', 'subCategory']
        }
      }],
      order: 'updatedAt DESC',
      limit: 8
    };
    this.http.get({
      path: `public/reports/`,
      data: filter,
      encode: true
    }).subscribe((res) => {
      this.divisasReports = res.body;
    });
  }

  private loadRentaReports(reportTypeIds) {
    const filter = {
      where: {
        reportTypeId: {inq: reportTypeIds}
      },
      fields: ['id', 'name', 'strategyArea', 'sectionId', 'reportTypeId', 'updatedAt', 'smartContent', 'rTitle'],
      include: [{
        relation: 'reportType',
        scope: {
          include: ['mainCategory', 'subCategory']
        }
      }],
      order: 'updatedAt DESC',
      limit: 8
    };
    this.http.get({
      path: `public/reports/`,
      data: filter,
      encode: true
    }).subscribe((res) => {
      this.rentaReports = res.body;
    });
  }

  private loadOutstanding() {
    const filter = {
      where: {
        strategy: true
      },
      fields: ['id', 'name', 'strategyArea', 'sectionId', 'reportTypeId', 'updatedAt', 'smartContent', 'rTitle'],
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

      this.headerReport = this.reports.find(e => e.strategyArea === 'outstanding');
      this.area1Report = this.reports.find(e => e.strategyArea === 'report1');
      this.area2Report = this.reports.find(e => e.strategyArea === 'report2');
      this.area3Report = this.reports.find(e => e.strategyArea === 'report3');
      this.area4Report = this.reports.find(e => e.strategyArea === 'report4');
    });
  }
}
