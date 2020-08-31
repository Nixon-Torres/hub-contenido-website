import { Component, OnInit } from '@angular/core';
import {HttpService} from '../../../../services/http.service';
import {environment} from '../../../../../environments/environment';
import * as moment from 'moment';
import {Router} from '@angular/router';

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

  constructor(private http: HttpService, private router: Router) { }

  ngOnInit() {
    this.loadReports(1);
    this.loadContents();
    this.getDailyType();
  }

  getCategory(reportType) {
    return reportType ? reportType.description : '';
    /* return reportType && reportType.mainCategory && reportType.mainCategory.length ?
      reportType.mainCategory[0].description : ''; */
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
      fields: ['id', 'name', 'sectionId', 'reportTypeId', 'publishedAt', 'smartContent', 'rTitle', 'reads'],
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

      this.loadMultimedia(idx);
    });
  }

  go(item) {
    const type =  item && item.multimediaType ? item.multimediaType.name : '';

    if (type.toLowerCase() === 'webinar') {
      return window.open(item.params.url, '_blank');
    }
    this.router.navigate(['/multimedia', item ? item.id : 'none']);
  }

  public getType(content) {
    const type =  content && content.multimediaType ? content.multimediaType.name : '';
    return type.toUpperCase();
  }

  public getThumbSource(content) {
    if (!content) {
      return false;
    }
    const thumb = content.files && content.files.length ? content.files.find(e => e.key === 'thumbnail') : null;
    if (thumb) {
      return this.STORAGE_URL + thumb.clientPath;
    }
    return 'assets/images/play_btn.png';
  }

  private loadMultimedia(idx: number) {
    const filter = {
      where: {
        key: 'multimedia'
      },
      include: ['files'],
      order: idx === 1 ? 'updatedAt DESC' : 'reads DESC',
      limit: 6
    };
    this.http.get({
      path: `public/contents/`,
      data: filter,
      encode: true
    }).subscribe((res) => {
      let multimedia: any = res.body;
      multimedia = multimedia.map(e => {
        return {
          ...e,
          rTitle: e.title,
          publishedAt: e.updatedAt,
          multimedia: true
        };
      });

      this.reports = this.reports.concat(multimedia)
        .sort((a: any, b: any) => {
          if (idx === 2) {
            return a.reads > b.reads ? -1 : a.reads < b.reads ? 1 : 0;
          }
          const fdate: any = moment(a.publishedAt);
          const sdate: any = moment(b.publishedAt);
          const diff: number = sdate.diff(fdate);
          return  diff > 0 ? 1 : diff < 0 ? -1 : 0;
        }).slice(0, 5);
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

  tagRightBanner(rightBanner: any){
    window.dataLayer = window.dataLayer || [];
    window.dataLayer.push({'eventCategory': 'Home','eventAction': 'Banner derecha -  Descargar','eventLabel': rightBanner,'eventvalue': '','event': 'eventClick'});
  }

  tagRightBannerView(rightBanner: any){
    window.dataLayer = window.dataLayer || [];
    window.dataLayer.push({'eventCategory': 'Home','eventAction': 'Banner derecha -  Ver informe','eventLabel': rightBanner,'eventvalue': '','event': 'eventClick'});
  }

  tagTab1(){
    window.dataLayer = window.dataLayer || [];
    window.dataLayer.push({'eventCategory': 'Home','eventAction': 'Informes','eventLabel': 'Últmimos informes','eventvalue': '','event': 'eventClick'});
  }

  tagTab2(){
    window.dataLayer = window.dataLayer || [];
    window.dataLayer.push({'eventCategory': 'Home','eventAction': 'Informes','eventLabel': 'Más leídos','eventvalue': '','event': 'eventClick'});
  }

  tagLastReport(lastReport: any){
    window.dataLayer = window.dataLayer || [];
    window.dataLayer.push({'eventCategory': 'Home','eventAction': lastReport,'eventLabel': window.location.href,'eventvalue': '','event': 'eventClick'});
  }
}
