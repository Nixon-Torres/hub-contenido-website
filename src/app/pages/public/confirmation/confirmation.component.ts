import {Component, OnInit} from '@angular/core';
import {HttpService} from '../../../services/http.service';
import {FormArray, FormControl, FormGroup, Validators} from '@angular/forms';
import {environment} from '../../../../environments/environment';
import {ActivatedRoute, Router} from '@angular/router';
import { Location } from '@angular/common';
import {DataService} from '../../../data.service';

@Component({
  selector: 'app-confirmation',
  templateUrl: './confirmation.component.html',
  styleUrls: ['./confirmation.component.scss']
})
export class ConfirmationComponent implements OnInit {
  public STORAGE_URL = environment.URL_API;

  public relateds: any;
  public content: any;
  public data: any;

  public route: any;
  private accessToken;
  public subscriptions: any;

  public EDITCONFIRMED = '/edit_confirmation';
  public EDITCOMPLETEDCONFIRMED = '/edit_completed_confirmation';
  public SUBCONFIRMED = '/subscribe_confirmation';
  public SUB2FACTORCONFIRMED = '/sub2factor_confirmation';
  public UNSUBCONFIRMED = '/unsubscribe_confirmation';
  public UNSUBCOMPLETEDCONFIRMED = '/unsubscribe_completed_confirmation';
  public QUINCENALCONFIRMED = '/quincenal_confirmation';

  public subscriptionData: any;

  constructor(private http: HttpService, private location: Location, private router: Router,
              private dataService: DataService, private activatedRoute: ActivatedRoute) {
    this.subscriptionData = this.dataService.subscriptionData;

    router.events.subscribe(val => {
      if (location.path() !== '') {
        this.route = location.path();
      } else {
        this.route = 'Home';
      }

      /* if (this.route === this.SUB2FACTORCONFIRMED && !this.subscriptionData) {
        this.router.navigate(['/preferences']);
      } */
    });
  }

  ngOnInit() {
    this.getRelated();
    this.getContent();

    this.activatedRoute.queryParams.subscribe((params: any) => {
      if (params.access_token) {
        this.accessToken = params.access_token;

        this.getSubscriptions();
      }
    });
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

  getRelated() {
    const filter = {
      where: {
      },
      limit: 3,
      include: [{
        relation: 'reportType',
        scope: {
          include: ['mainCategory', 'subCategory']
        }
      }],
      order: 'publishedAt DESC'
    };
    this.http.get({
      path: `public/reports/`,
      data: filter,
      encode: true
    }).subscribe((res) => {
      this.relateds = res.body;
    });
  }

  getCategory(reportType) {
    return reportType ? reportType.description : '';
    /* return reportType && reportType.mainCategory && reportType.mainCategory.length ?
      reportType.mainCategory[0].description : ''; */
  }

  private getSubscriptions() {
    if (!this.accessToken) {
      return;
    }
    this.http.get({
      path: 'public/subscriptions?access_token=' + this.accessToken
    }).subscribe((res) => {
      this.subscriptions = (res.body as any).data.filter(e => e.type === 'REPORTTYPE');

      if (this.subscriptions.length === 0) {
        this.unsubscribe();
      }
    });
  }

  public unsubscribe() {
    this.http.post({
      path: 'public/unsubscribe?access_token=' + this.accessToken
    }).subscribe((res) => {
      this.router.navigate(['/unsubscribe_completed_confirmation']);
    });
  }

  tagConfirmation(parameter: any){
    var response = parameter > -1 ? 'Suscripción activada' : 'Revisión Bandeja';
    window.dataLayer = window.dataLayer || [];
    window.dataLayer.push({'eventCategory': 'Suscripción boletin quincenal','eventAction': 'Volver al inicio','eventLabel': response,'eventvalue': '','event': 'eventClick'});
  }
}
