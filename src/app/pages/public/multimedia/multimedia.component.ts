import {Component, OnInit} from '@angular/core';
import {HttpService} from '../../../services/http.service';
import {environment} from '../../../../environments/environment';
import { forkJoin } from 'rxjs';

@Component({
    selector: 'app-multimedia',
    templateUrl: './multimedia.component.html',
    styleUrls: ['./multimedia.component.scss']
})
export class MultimediaComponent implements OnInit {
  public STORAGE_URL = environment.URL_API;
  public contents: any = [];
  public header: any;
  public item1: any;
  public item2: any;
  public item3: any;
  public breadcrumbItems: Array<any> = [];
  categories = [];
  readonly TOTAL_PER_PAGE = 3;
  public currentTab = 1;
  category: string;

  constructor(private http: HttpService) { }

  ngOnInit() {
    this.loadContents();
    this.loadMultimedia();
    this.onLoadCategories();
  }

  private getType(item: any) {
    return item && item.multimediaType ? item.multimediaType.name : 'none';
  }

  private getSelectedType() {
    return this.currentTab === 1 ? 'Video' : this.currentTab === 2 ? 'Podcast' : 'Webinar';
  }

  private setTab(idx) {
    this.contents = [];
    this.currentTab = idx;
    this.loadMultimedia();
  }

  public loadMultimedia() {
    const filter = {
      where: {
        key: 'multimedia',
        'multimediaType.name': this.getSelectedType()
      },
      include: ['files'],
      order: 'createdAt DESC',
      limit: this.TOTAL_PER_PAGE,
      skip: this.contents.length
    };
    this.http.get({
      path: `public/contents/`,
      data: filter,
      encode: true
    }).subscribe((res) => {
      const contents = res.body as any;
      this.contents = this.contents.concat(contents).filter(con => !con.trash);
    });
  }

  private loadContents() {
    const filter = {
      where: {
        key: 'multimedia',
        outstanding: true
      },
      include: ['files'],
      order: 'createdAt DESC'
    };
    this.http.get({
      path: `public/contents/`,
      data: filter,
      encode: true
    }).subscribe((res) => {
      const contents = res.body as any;
      contents.filter(con => !con.trash);
      this.header = contents.find(e => e.outstandingArea === 'header');
      this.item1 = contents.find(e => e.outstandingArea === 'area1');
      this.item2 = contents.find(e => e.outstandingArea === 'area2');
      this.item3 = contents.find(e => e.outstandingArea === 'area3');
    });
  }

  public getThumbSource(content) {
    const thumb = content.files && content.files.length ? content.files.find(e => e.key === 'thumbnail') : null;
    if (thumb) {
      return this.STORAGE_URL + thumb.clientPath;
    }
    return 'assets/images/play_btn.png';
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
    });
  }

  getCategoy(content: any) {
    return this.category = content && content.params && content.params.category
      && this.categories.find(cat => cat.id === content.params.category)
      ? this.categories.find(cat => cat.id === content.params.category).description
      : 'Corredores Davivienda';
  }
}
