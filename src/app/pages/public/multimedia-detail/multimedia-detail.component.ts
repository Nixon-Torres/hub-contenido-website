import { Component, OnInit } from '@angular/core';
import { HttpService } from '../../../services/http.service';
import { ActivatedRoute, PRIMARY_OUTLET, Router, UrlSegment, UrlSegmentGroup, UrlTree } from '@angular/router';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { forkJoin } from 'rxjs';

@Component({
  selector: 'app-multimedia-detail',
  templateUrl: './multimedia-detail.component.html',
  styleUrls: ['./multimedia-detail.component.scss']
})
export class MultimediaDetailComponent implements OnInit {
  public content: any;
  public contentId: string;
  public videoId: string;
  public type: string;
  public relateds: any;
  public isIframe = false;
  public breadcrumbItems: Array<any> = [{
    label: 'Multimedia',
    link: ['/multimedia']
  }];
  categories = [];
  category: any;

  constructor(private http: HttpService,
    private activatedRoute: ActivatedRoute,
    private router: Router, private sanitizer: DomSanitizer) {
  }

  ngOnInit() {
    this.activatedRoute.paramMap.subscribe((params: any) => {
      if (params.get('id')) {
        this.contentId = params.get('id');
        this.loadContent(this.contentId);
      }
    });
  }

  viewContent(contentId: string) {
    this.http.get({
      path: `public/contents/${contentId}/view`
    }).subscribe((res) => {
    });
  }

  public onLoadCategories() {
    const observables = this.http.get({
      path: 'public/sections/',
      data: {
        include: [
          {
            relation: 'reportsType',
            scope: {
              include: 'mainCategory'
            }
          }
        ],
        order: 'priority DESC'
      },
      encode: true
    });
    const observables2 = this.http.get({ path: 'public/companies/' });

    forkJoin([observables, observables2]).subscribe((results: any) => {
      const categories = results && results[0] && results[0].body
        ? results[0].body
        : [];
      const companies = results && results[1] && results[1].body
        ? results[1].body.map(e => {
          e.description = e.name ? e.name : e.description;
          return e;
        })
        : [];

      const categoriesList = categories.map((e) => Object.assign({}, e));
      this.categories = categoriesList.flatMap(x => x.reportsType)
        .concat(companies)
        .map(e => {
          e.description = e.fullDescription ? e.fullDescription : e.description;
          return e;
        })
        .reduce((y, x) => {
          if (!y.find((e) => e.description === x.description)) {
            y.push(x);
          }
          return y;
        }, []);

      this.getCategoy();
    });
  }

  loadContent(contentId: string) {
    const filter = {
      where: {
        id: contentId
      },
      include: ['files']
    };
    this.http.get({
      path: `public/contents/`,
      data: filter,
      encode: true
    }).subscribe((res) => {
      this.viewContent(contentId);
      this.content = res.body[0];
      this.type = this.content && this.content.multimediaType ? this.content.multimediaType.name : null;

      const label = this.content.title && this.content.title.length > 70 ?
                      this.content.title.substring(0, 70) + '...' : this.content.title;
      this.breadcrumbItems = [{
        label: 'Multimedia',
        link: ['/multimedia']
      }, {
        label
      }];

      if (this.content && this.content.params && this.content.params.url && this.type === 'Video') {
        this.getVideoUrl();
      }

      this.isIframe = this.content.params.url.indexOf('<iframe') > -1;
      this.getRelated();
      this.onLoadCategories();
    });
  }

  getCategoy() {
    this.category = this.content && this.content.params && this.content.params.category
      && this.categories.find(cat => cat.id === this.content.params.category)
      ? this.categories.find(cat => cat.id === this.content.params.category).description
      : 'Corredores Davivienda';
  }

  getRelated() {
    const filter = {
      where: {
        id: {
          inq: this.content.params ? this.content.params.relatedReports : []
        }
      },
      limit: 3,
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
      this.relateds = res.body;
    });
  }

  getUrlParameter(url, name) {
    name = name.replace(/[\[]/, '\\[').replace(/[\]]/, '\\]');
    const regex = new RegExp('[\\?&]' + name + '=([^&#]*)');
    const results = regex.exec(url);
    return results === null ? '' : decodeURIComponent(results[1].replace(/\+/g, ' '));
  }

  getVideoUrl() {
    let url;
    if (this.content && this.content.params && this.content.params.url && this.type === 'Video') {
      url = new URL(this.content.params.url);
      if (url && url.search) {
        this.videoId = this.getUrlParameter(url, 'v');
        url = `https://www.youtube.com/embed/${this.videoId}?enablejsapi=1`;
      }
    }
    return this.sanitizer.bypassSecurityTrustResourceUrl(url);
  }

  getPodcastUrl() {
    if (this.content && this.content.params && this.content.params.url && this.type === 'Podcast') {
      return this.sanitizer.bypassSecurityTrustResourceUrl(this.content.params.url);
    }
    return null;
  }

  getPodcastHtml() {
    if (this.content && this.content.params && this.content.params.url && this.type === 'Podcast') {
      return this.sanitizer.bypassSecurityTrustHtml(this.content.params.url);
    }
    return null;
  }

  getWebinarUrl() {
    if (this.content && this.content.params && this.content.params.url && this.type === 'Webinar') {
      return this.sanitizer.bypassSecurityTrustResourceUrl(this.content.params.url);
    }
    return null;
  }

  getCategory(reportType) {
    return reportType.description;
    /* return reportType && reportType.mainCategory && reportType.mainCategory.length ?
      reportType.mainCategory[0].description : ''; */
  }
}
