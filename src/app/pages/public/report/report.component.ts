import {AfterViewInit, Component, ElementRef, OnInit, Sanitizer, ViewEncapsulation} from '@angular/core';
import {HttpService} from '../../../services/http.service';
import {ActivatedRoute} from '@angular/router';
import {environment} from '../../../../environments/environment';
import { DomSanitizer } from '@angular/platform-browser';
import * as $ from 'jquery';
import 'bootstrap';
import {main} from '@angular/compiler-cli/src/main';
import {combineLatest} from 'rxjs';

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
    public categoryId: string;
    public breadcrumbItems: Array<any> = [];

    constructor(private http: HttpService, private activatedRoute: ActivatedRoute,
                private sanitizer: DomSanitizer, private elementRef: ElementRef) {
    }

    ngOnInit() {
      const oparams = this.activatedRoute.params;
      const oqueryParams = this.activatedRoute.queryParams;

      combineLatest(oparams, oqueryParams,
        (iparams, iqueryParams) => ({ iparams, iqueryParams }))
        .subscribe(response => {
          const queryParams = response.iqueryParams;
          const params = response.iparams;

          if (queryParams.catId) {
            this.categoryId = queryParams.catId;
          }

          if (params.id) {
            this.reportId = params.id;
            this.getReport(this.reportId);
            this.loadReport(this.reportId);
          }
        });
    }

    ngAfterViewInit(): void {
      setTimeout(() => {
        const button = document.querySelector('app-button');
        if (!button) {
          return;
        }
        button.addEventListener('action', (event: any) => {
          if (event && event.detail) {
            $('body').addClass('modal-open');
          } else {
            $('body').removeClass('modal-open');
          }
        });
      }, 2000);

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
            const category = mainCategory.find(e => !this.categoryId || (this.categoryId && this.categoryId === e.id));
            this.breadcrumbItems = [{
              label: category.description,
              link: ['/categories', category.id]
            }];

            if (reportType) {
              let alias = reportType.description;

              if (this.categoryId && reportType.aliases && reportType.aliases[this.categoryId]) {
                alias = reportType.aliases[this.categoryId];
              }
              this.breadcrumbItems.push({
                label: alias,
                link: ['/categories', category.id, 'type', reportType.id]
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

            setTimeout(() => {
              const parent = document.getElementById('marketingCode') as HTMLElement;
              const scripts = parent.getElementsByTagName('script') as unknown as HTMLScriptElement[];
              const scriptsInitialLength = scripts.length;
              for (let i = 0; i < scriptsInitialLength; i++) {
                const script = scripts[i];
                const scriptCopy = document.createElement('script') as HTMLScriptElement;
                scriptCopy.type = script.type ? script.type : 'text/javascript';
                if (script.innerHTML) {
                  scriptCopy.innerHTML = script.innerHTML;
                } else if (script.src) {
                  scriptCopy.src = script.src;
                }
                scriptCopy.async = false;
                script.parentNode.replaceChild(scriptCopy, script);
              }
            }, 1000);
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
    const url = 'https://www.linkedin.com/shareArticle?mini=true&url=' + window.location.href + '&title=LinkedIn%20Developer%20Network&summary=My%20favorite%20developer%20program&source=LinkedIn';
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
