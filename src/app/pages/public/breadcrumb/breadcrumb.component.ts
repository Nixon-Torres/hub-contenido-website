import {Component, Input, OnInit} from '@angular/core';
import {Location} from '@angular/common';
import {ActivatedRoute, Router} from '@angular/router';

@Component({
  selector: 'app-breadcrumb',
  templateUrl: './breadcrumb.component.html',
  styleUrls: ['./breadcrumb.component.scss']
})
export class BreadcrumbComponent implements OnInit {
  @Input() pages: Array<any>;

  constructor( private location: Location, private router: Router, private activatedRouted: ActivatedRoute) {
  }

  ngOnInit() {
  }

  goBack() {
    this.location.back();
  }
}
