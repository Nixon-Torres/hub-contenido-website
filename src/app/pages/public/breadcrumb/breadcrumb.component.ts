import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {Location} from '@angular/common';
import {ActivatedRoute, Router} from '@angular/router';

@Component({
  selector: 'app-breadcrumb',
  templateUrl: './breadcrumb.component.html',
  styleUrls: ['./breadcrumb.component.scss']
})
export class BreadcrumbComponent implements OnInit {
  @Input() pages: Array<any>;
  @Output() back = new EventEmitter<boolean>();

  constructor( private location: Location, private router: Router, private activatedRouted: ActivatedRoute) {
  }

  ngOnInit() {
  }

  goBack() {
    this.back.emit(true);
    this.location.back();
  }
}
