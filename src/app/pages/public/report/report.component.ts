import {AfterViewInit, Component, OnInit, Sanitizer, ViewEncapsulation} from '@angular/core';
import {HttpService} from '../../../services/http.service';
import {ActivatedRoute} from '@angular/router';
import {environment} from '../../../../environments/environment';
import { DomSanitizer } from '@angular/platform-browser';
import * as $ from 'jquery';
import 'bootstrap';
import {main} from '@angular/compiler-cli/src/main';

@Component({
    selector: 'app-report',
    templateUrl: './report.component.html',
    styleUrls: ['./report.component.scss'],
    encapsulation: ViewEncapsulation.None
})
export class ReportComponent implements OnInit, AfterViewInit {
    public myhtml: any;
    public report: any;
    public reportId: string;
    public breadcrumbItems: Array<any> = [];

    constructor(private http: HttpService, private activatedRoute: ActivatedRoute,
                private sanitizer: DomSanitizer) {
    }

    ngOnInit() {
        this.activatedRoute.paramMap.subscribe((params: any) => {
            // Load report for edit, but if is a new report load basic data from URI
            if (params.get('id')) {
                this.reportId = params.get('id');
                this.getReport(this.reportId);
                this.loadReport(this.reportId);
            }
        });
    }

    ngAfterViewInit(): void {
      setTimeout(() => {
        ( $('[data-toggle="tooltip"]') as any).tooltip();

        $('.circle.twitter').on('click', () => {
          this.shareOntwitter();
        });

        $('.circle.linkedin').on('click', () => {
          this.shareOnLinkedin();
        });

        $('.circle.link').on('click', () => {
          this.copyToClipboard(window.location);
        });
      }, 1000);
    }

    getReport(reportId: string) {
      const filter = {
        where: {
          id: reportId
        },
        fields: ['reportTypeId'],
        include: [{
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
        if (res.body && (res.body as any).length) {
          this.report = res.body[0];

          if (!this.report.reportType) {
            return;
          }

          const mainCategory = this.report.reportType.mainCategory;
          const reportType = this.report.reportType;

          if (mainCategory && mainCategory.length) {
            this.breadcrumbItems = [{
              label: mainCategory[0].description,
              link: ['/categories', mainCategory[0].id]
            }];

            if (reportType) {
              this.breadcrumbItems.push({
                label: reportType.description,
                link: ['/categories', mainCategory[0].id, 'type', reportType.id]
              });
            }
          }
        }
      });
    }

  loadReport(reportId: string) {
        const filter = {
            where: {
                id: reportId
            }
        };
        this.http.getHTML({
            path: `public/reports/${this.reportId}/view`,
            data: filter,
            encode: true
        }).subscribe((res) => {
            const html = (res.body as unknown as string); // .replace(/\/public\/reports\//g, environment.URL_API + 'public/reports/');
            this.myhtml = this.sanitizer.bypassSecurityTrustHtml(html);
        });
    }

  shareOntwitter() {
    const url = 'https://twitter.com/intent/tweet?url=' + window.location + '&via=vision&text=Check%20this%20out';
    const w = 600;
    const h = 300;
    const left = (screen.width / 2) - (w / 2);
    const top = (screen.height / 2) - (h / 2);
    window.open(url, '_blank', 'menubar=no,toolbar=no,resizable=none,scrollbars=no,height=' +
      h + ',width=' + w + ',top=' + top + ',left=' + left);
    return false;
  }

  shareOnLinkedin() {
    const w = 600;
    const h = 300;
    const left = (screen.width / 2) - (w / 2);
    const top = (screen.height / 2) - (h / 2);
    // tslint:disable-next-line:max-line-length
    const url = 'https://www.linkedin.com/shareArticle?mini=true&url=https://stg-hub-pub.qdata.io&title=LinkedIn%20Developer%20Network&summary=My%20favorite%20developer%20program&source=LinkedIn';
    window.open(url, '_blank', 'menubar=no,toolbar=no,resizable=none,scrollbars=no,height=' +
      h + ',width=' + w + ',top=' + top + ',left=' + left);
    return false;
  }

  copyToClipboard(str) {
    const el = document.createElement('textarea');
    el.value = str;
    document.body.appendChild(el);
    el.select();
    document.execCommand('copy');
    document.body.removeChild(el);
  }
}
