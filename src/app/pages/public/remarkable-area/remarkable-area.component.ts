import { Component, OnInit } from '@angular/core';
import { HttpService } from '../../../services/http.service';
import { environment } from '../../../../environments/environment';

@Component({
  selector: 'app-remarkable-area',
  templateUrl: './remarkable-area.component.html',
  styleUrls: ['./remarkable-area.component.scss']
})
export class RemarkableAreaComponent implements OnInit {
  public reports: any;
  public headerReport: any;
  public area1Report: any;
  public area2Report: any;
  public area3Report: any;
  public area4Report: any;

  public assetBase: string = environment.URL_API;
  constructor(private http: HttpService) { }

  ngOnInit() {
    this.loadOutstanding();
  }

  private loadOutstanding() {
    const filter = {
      where: {
        outstanding: true
      },
      fields: ['id', 'name', 'outstandingArea', 'sectionId', 'sectionTypeKey', 'updatedAt'],
      include: ['files', 'section']
    };
    this.http.get({
      path: `public/reports/`,
      data: filter,
      encode: true
    }).subscribe((res) => {
      this.reports = res.body;

      this.reports = this.reports.map(e => {
        e.files = e.files.filter(j => j.key === 'outstandingimage');
        e.image = e.files && e.files.length ? e.files[0] : null;

        if (e.section && e.section.types && e.section.types.length) {
          e.type = e.section.types.find(k => k.key === e.sectionTypeKey);
        } else {
          e.type = null;
        }
        return e;
      });

      this.headerReport = this.reports.find(e => e.outstandingArea === 'header');
      this.area1Report = this.reports.find(e => e.outstandingArea === 'area1');
      this.area2Report = this.reports.find(e => e.outstandingArea === 'area2');
      this.area3Report = this.reports.find(e => e.outstandingArea === 'area3');
      this.area4Report = this.reports.find(e => e.outstandingArea === 'area4');
    });
  }
}
