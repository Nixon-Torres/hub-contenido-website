import {Component, OnInit} from '@angular/core';
import {HttpService} from '../../../services/http.service';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {environment} from '../../../../environments/environment';

@Component({
  selector: 'app-book',
  templateUrl: './book.component.html',
  styleUrls: ['./book.component.scss']
})
export class BookComponent implements OnInit {
  public subscriber: any = {};
  public subscribeGroup: FormGroup;
  public submitted = false;
  public content: any;
  public data: any;
  public STORAGE_URL = environment.URL_API;

  constructor(private http: HttpService) {
    this.subscribeGroup = new FormGroup({
      name: new FormControl('', Validators.required),
      lastName: new FormControl('', Validators.required),
      email: new FormControl('', Validators.required),
      knowledge: new FormControl('', Validators.required),
      sector: new FormControl('', Validators.required),
      accept: new FormControl(false, [Validators.required, Validators.requiredTrue]),
      subscribe: new FormControl(''),
    });
  }

  ngOnInit() {
    this.getContent();
  }

  getContent() {
    this.http.get({
      path: 'public/contents/',
      data: {
        where: {
          key: 'thebookKey'
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

  subscribe() {
    if (this.subscribeGroup.status === 'INVALID') {
      console.log('invalid!');
      return;
    }

    this.submitted = true;
    this.http.post({
      path: 'public/subscribe/thebook',
      data: {
        subscriber: this.subscriber
      }
    }).subscribe((res) => {
    });
  }
}
