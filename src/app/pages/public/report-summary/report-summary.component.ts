import { Component, OnInit } from '@angular/core';
import {HttpService} from '../../../services/http.service';

@Component({
  selector: 'app-report-summary',
  templateUrl: './report-summary.component.html',
  styleUrls: ['./report-summary.component.scss']
})
export class ReportSummaryComponent implements OnInit {
  public reports: any;
  public headerReport: any;
  public area1Report: any;
  public area2Report: any;
  public area3Report: any;
  public area4Report: any;

  constructor(private http: HttpService) { }

  ngOnInit() {
    this.loadOutstanding();
  }

  private loadOutstanding() {
    const filter = {
      where: {
        strategy: true
      },
      fields: ['id', 'name', 'strategyArea', 'sectionId', 'sectionTypeKey', 'updatedAt', 'smartContent'],
      include: ['files', 'section'],
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
