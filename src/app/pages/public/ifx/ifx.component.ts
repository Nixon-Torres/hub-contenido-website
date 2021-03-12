import {Component, OnInit} from '@angular/core';
import {HttpService} from '../../../services/http.service';
import {environment} from '../../../../environments/environment';
import {DomSanitizer} from '@angular/platform-browser';

@Component({
  selector: 'app-book',
  templateUrl: './ifx.component.html',
  styleUrls: ['./ifx.component.scss']
})
export class IfxComponent implements OnInit {
  public reports: any;
  public content: any;
  public data: any;
  public ifxContent: any;
  public sections: any;
  public breadcrumbItems: Array<any> = [{
    label: 'Indicadores',
    link: ['/indicators']
  }];

  public STORAGE_URL = environment.URL_API;

  constructor(private http: HttpService, private sanitizer: DomSanitizer) {
  }

  ngOnInit() {
    this.getContent();
    this.getSections();
    this.loadReports();
  }

  getCategory(reportType) {
    return reportType.description;
    /* return reportType && reportType.mainCategory && reportType.mainCategory.length ?
      reportType.mainCategory[0].description : ''; */
  }

  private loadReports() {
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
      order: 'publishedAt DESC',
      limit: 3
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

          e.files = e.files.filter(j => j.key.toLowerCase() === 'thumbimage');
          e.image = e.files && e.files.length ? e.files[0] : null;
          return e;
        });
    });
  }

  getContent() {
    this.http.get({
      path: 'public/contents/',
      data: {
        where: {
          key: 'IndicatorsContentKey'
        },
        include: ['files']
      },
      encode: true
    }).subscribe((res) => {
      if (res && res.body && (res.body as any).length) {
        this.content = res.body[0];
        this.data = {};
        this.content.blocks.forEach((e) => {
          this.data[e.id] = e.content;
        });

        this.content.blocks.forEach((e) => {
          const image = this.content.files.find(j => j.key === 'blockImage-' + e.id);
          if (image) {
            image.assetUrl = this.STORAGE_URL + image.clientPath;
            this.data[e.id] = image;
          }
        });
      }
    });
  }

  getHTML(html) {
    return this.sanitizer.bypassSecurityTrustHtml(html);
  }

  getSections() {
    this.http.get({
      path: 'public/contents/',
      data: {
        where: {
          key: 'indicatorsSectionKey'
        },
        include: ['files']
      },
      encode: true
    }).subscribe((res) => {
      if (res && res.body && (res.body as any).length) {
        this.ifxContent = res.body[0];
        this.sections = this.ifxContent.books;

        this.sections = this.sections.map((book) => {
          const blocks = this.ifxContent.blocks.filter(e => e.bookId === book.id);
          const title = blocks.find(e => e.id && e.id.indexOf('title') > -1);
          const content = blocks.find(e => e.id && e.id.indexOf('content') > -1);

          book.title = title.content;
          book.content = content.content;
          return book;
        });
      }
    });
  }
}
