import {Component, OnInit} from '@angular/core';
import {HttpService} from '../../../services/http.service';
import {FormControl, FormGroup, Validators} from '@angular/forms';

@Component({
  selector: 'app-book',
  templateUrl: './book.component.html',
  styleUrls: ['./book.component.scss']
})
export class BookComponent implements OnInit {
  public subscriber: any = {};
  public subscribeGroup: FormGroup;
  public submitted = false;

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
