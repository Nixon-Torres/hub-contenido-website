import {Component, OnInit} from '@angular/core';
import {HttpService} from '../../../services/http.service';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {environment} from '../../../../environments/environment';
import {ActivatedRoute, Router} from '@angular/router';

@Component({
  selector: 'app-confirmation',
  templateUrl: './confirmation.component.html',
  styleUrls: ['./confirmation.component.scss']
})
export class ConfirmationComponent implements OnInit {

  constructor(private http: HttpService, private router: Router) {
  }

  ngOnInit() {
  }
}
