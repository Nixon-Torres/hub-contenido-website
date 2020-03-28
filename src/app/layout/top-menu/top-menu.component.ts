
import { Component, OnInit } from '@angular/core';

@Component({
    selector: 'app-top-menu',
    templateUrl: './top-menu.component.html',
    styleUrls: ['./top-menu.component.scss']
})

export class TopMenuComponent implements OnInit {
    public subMenuVisible = false;
    public currentMenuOption: number;
    constructor() {}

    ngOnInit() {
    }

  mouseEnter(idx?: number) {
    this.subMenuVisible = true;
    this.currentMenuOption = idx;
  }

  mouseLeave() {
    this.subMenuVisible = false;
  }
}
