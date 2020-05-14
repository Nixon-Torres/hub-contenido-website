import { Component, OnInit } from '@angular/core';
import {HttpService} from '../../services/http.service';
import {Router} from '@angular/router';
import {GoogleTagManagerService} from 'angular-google-tag-manager';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {
  public reportsList: Array<any>;
  public searchText: string;

  constructor(
      private http: HttpService,
      private router: Router,
      private gtmService: GoogleTagManagerService
  ) { }

  ngOnInit() {
    this.onLoadReports();

  }

  onLoadReports() {
    this.http.get({
      path: 'public/reports',
      data: {
        include: ['user', 'reportType', {
          relation: 'reportType',
          scope: {
            include: ['mainCategory', 'subCategory']
          }
        }],
        where: {
          stateId: '5e068c81d811c55eb40d14d0'
        }
      },
      encode: true
    }).subscribe((resp: any) => {
      this.reportsList = resp.body;
      this.onLoadMultimedia(this.reportsList);
    });
  }

  onLoadMultimedia(list) {
    this.http.get({
      path: 'public/contents',
      data: {
        include: ['lastUpdater'],
        where: {
          key: 'multimedia'
        }
      },
      encode: true
    }).subscribe((resp: any) => {

    });
  }

  redirectSelection(event) {
    const location = event.multimediaType ? '/multimedia' : '/reports'
    if (event && event.id) {
      this.router.navigate([location, event.id]);
    }
  }

  customSearchFn(term: string, item: any) {
    term = term.toLowerCase();
    const publishedDate = new Date(item.publishedAt);
    const dateString = `${publishedDate.getDate()}/${publishedDate.getMonth() + 1}/${publishedDate.getFullYear()}`;
    const name = item.name ? 'name' : 'title';
    const author = item.name ? 'user' : 'lastUpdater';
    return item[name].toLowerCase().indexOf(term) > -1 ||
        item[author].name.toLowerCase().indexOf(term) > -1 ||
        dateString.indexOf(term) > -1 ||
        item.reportType.mainCategory.find(e => e.description.toLowerCase().indexOf(term) > -1);
  }

  searchEvent() {
    this.router.navigate(['/search'], { queryParams: { s: this.searchText } });
  }
}
