import { Component, OnInit } from '@angular/core';
import {NavigationEnd, Router} from '@angular/router';
import {HttpService} from "./services/http.service";
import {GoogleTagManagerService} from "angular-google-tag-manager";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  title = 'hub-contenidos-front';

  constructor(private router: Router, private gtmService: GoogleTagManagerService) {
    this.gtmService.addGtmToDom();
  }

  ngOnInit() {
    this.router.events.subscribe((evt) => {
      if (!(evt instanceof NavigationEnd)) {
        return;
      }
      window.scrollTo(0, 0);
    });
  }
}
