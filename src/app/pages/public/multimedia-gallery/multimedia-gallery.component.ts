import { Component, OnInit } from '@angular/core';
import { environment } from '../../../../environments/environment';
import {HttpService} from '../../../services/http.service';
import * as moment from 'moment';
import {Router} from '@angular/router';

@Component({
  selector: 'app-multimedia-gallery',
  templateUrl: './multimedia-gallery.component.html',
  styleUrls: ['./multimedia-gallery.component.scss']
})
export class MultimediaGalleryComponent implements OnInit {

  public STORAGE_URL = environment.URL_API;
  public contents: any = [];
  public item1: any;
  public item2: any;
  public item3: any;

  constructor(private http: HttpService, private router: Router) { }

  ngOnInit() {
    this.loadContents();
  }

  go(item) {
    const type =  item && item.multimediaType ? item.multimediaType.name : '';

    if (type.toLowerCase() === 'webinar') {
      return window.open(item.params.url, '_blank');
    }
    this.router.navigate(['/multimedia', item ? item.id : 'none']);
  }

  isNewContent(content: any) {
    const diff = moment().diff(content.createdAt, 'hours');
    return diff < 24;
  }

  public getType(content) {
    const type =  content && content.multimediaType ? content.multimediaType.name : '';
    return type.toUpperCase();
  }

  public getThumbSource(content) {
    const thumb = content.files && content.files.length ? content.files.find(e => e.key === 'thumbnail') : null;
    if (thumb) {
      return this.STORAGE_URL + thumb.clientPath;
    }
    return 'assets/images/play_btn.png';
  }

  private loadContents() {
    const filter = {
      where: {
        key: 'multimedia',
        outstandingHome: true
      },
      include: ['files'],
      order: 'createdAt DESC'
    };
    this.http.get({
      path: `public/contents/`,
      data: filter,
      encode: true
    }).subscribe((res) => {
      this.contents = res.body;

      this.item1 = this.contents.find(e => e.outstandingArea === 'area1');
      this.item2 = this.contents.find(e => e.outstandingArea === 'area2');
      this.item3 = this.contents.find(e => e.outstandingArea === 'area3');
    });
  }

}
