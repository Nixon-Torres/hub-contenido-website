import { Component, OnInit } from '@angular/core';
import {HttpService} from '../../services/http.service';
import {environment} from '../../../environments/environment';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss']
})
export class FooterComponent implements OnInit {
  public content: any;
  public data: any;

  public STORAGE_URL = environment.URL_API;

  constructor(private http: HttpService) { }

  ngOnInit() {
    this.getContent();
  }

  getTarget(link) {
    const host = window.location.hostname;
    const idx = link.indexOf(host);
    return  idx > -1 ? '_self' : '_blank';
  }

  getContent() {
    this.http.get({
      path: 'public/contents/',
      data: {
        where: {
          key: 'footerKey'
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

  tagFooter(footer_option: any){
    window.dataLayer = window.dataLayer || [];
    window.dataLayer.push({'eventCategory': 'Footer','eventAction': footer_option,'eventLabel': window.location.href,'eventvalue': '','event': 'eventClick'});
  }
}
