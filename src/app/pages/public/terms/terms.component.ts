import {Component, OnInit} from '@angular/core';
import {HttpService} from '../../../services/http.service';
import {ActivatedRoute, Router} from '@angular/router';
import { Location } from '@angular/common';
import {DataService} from '../../../data.service';

@Component({
  selector: 'app-terms',
  templateUrl: './terms.component.html',
  styleUrls: ['./terms.component.scss']
})
export class TermsComponent implements OnInit {

  constructor(private http: HttpService, private location: Location, private router: Router,
              private dataService: DataService, private activatedRoute: ActivatedRoute) {
  }

  ngOnInit() {
  }
}
