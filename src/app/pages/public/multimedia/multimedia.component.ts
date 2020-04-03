import {Component, OnInit} from '@angular/core';
import {HttpService} from '../../../services/http.service';
import {environment} from '../../../../environments/environment';

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

  readonly TOTAL_PER_PAGE = 3;
  public currentTab = 1;

  constructor(private http: HttpService) { }

  ngOnInit() {
    this.loadContents();
    this.loadMultimedia();
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
      this.contents = this.contents.concat(contents);
    });
  }

  private loadContents() {
    const filter = {
      where: {
        key: 'multimedia',
        outstanding: true,
        outstandingHome: false
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
}
