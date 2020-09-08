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

  private getType(item: any) {
    return item && item.multimediaType ? item.multimediaType.name : 'none';
  }

  getCategory(reportType) {
    return reportType ? reportType.description : '';
    /* return reportType && reportType.mainCategory && reportType.mainCategory.length ?
      reportType.mainCategory[0].description : ''; */
  }

  private loadOutstandingMultimedia() {
    const filter = {
      where: {
        outstandingMainHome: true
      },
      include: ['files']
    };
    this.http.get({
      path: `public/contents/`,
      data: filter,
      encode: true
    }).subscribe((res) => {
      const multimedia: any = (res.body as any).map(e => {
        e.files = e.files.filter(j => (e.outstandingMainHomeArea === 'header' &&
          j.key.toLowerCase() === 'outstandingimage') ||
          (e.outstandingMainHomeArea !== 'header' &&
            j.key.toLowerCase() === 'thumbnail'));
        e.image = e.files && e.files.length ? e.files[0] : null;
        return {
          id: e.id,
          rTitle: e.title,
          smartContent: e.description,
          outstandingMainHomeArea: e.outstandingMainHomeArea,
          image: e.image,
          publishedAt: e.createdAt,
          multimedia: true,
          multimediaType: e.multimediaType,
          reportType: {
            description: e && e.params && e.params.categoryName ? e.params.categoryName : 'CORREDORES DAVIVIENDA',
          },
        };
      });

      const headerReport = multimedia.find(e => e.outstandingMainHomeArea === 'header');
      const area1Report = multimedia.find(e => e.outstandingMainHomeArea === 'area1');
      const area2Report = multimedia.find(e => e.outstandingMainHomeArea === 'area2');
      const area3Report = multimedia.find(e => e.outstandingMainHomeArea === 'area3');
      const area4Report = multimedia.find(e => e.outstandingMainHomeArea === 'area4');

      this.headerReport = headerReport ? headerReport : this.headerReport;
      this.area1Report = area1Report ? area1Report : this.area1Report;
      this.area2Report = area2Report ? area2Report : this.area2Report;
      this.area3Report = area3Report ? area3Report : this.area3Report;
      this.area4Report = area4Report ? area4Report : this.area4Report;
    });
  }

  public getLink(entry) {
    if (entry.multimedia) {
      return ['/multimedia', entry.id];
    }
    return ['/reports', entry.id];
  }

  private loadOutstanding() {
    const filter = {
      where: {
        outstanding: true
      },
      fields: ['id', 'name', 'outstandingArea', 'sectionId', 'reportTypeId', 'publishedAt', 'smartContent', 'rTitle'],
      include: ['files', 'section', {
        relation: 'reportType',
        scope: {
          include: ['mainCategory', 'subCategory']
        }
      }]
    };
    this.http.get({
      path: `public/reports/`,
      data: filter,
      encode: true
    }).subscribe((res) => {
      this.reports = res.body;

      this.reports = this.reports
          .filter(e => e.files && e.files.length && e.files.find(k => k.key.toLowerCase() === 'outstandingimage'))
          .map(e => {
            e.files = e.files.filter(j => j.key.toLowerCase() === 'outstandingimage');
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

      this.loadOutstandingMultimedia();
    });
  }
}
