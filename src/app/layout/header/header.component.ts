import {Component, OnInit} from '@angular/core';
import {HttpService} from '../../services/http.service';
import {Router} from '@angular/router';
import {GoogleTagManagerService} from 'angular-google-tag-manager';
import {EditPreferencesDialogComponent} from '../../pages/public/edit-preferences-dialog/edit-preferences-dialog.component';
import {SubscribeDialogComponent} from '../../pages/public/subscribe-dialog/subscribe-dialog.component';
import {MatDialog} from '@angular/material';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {
  public reportsList: Array<any>;
  public searchText: string;
  public subscribeMenuVisible = false;

  constructor(
    private dialog: MatDialog,
    private http: HttpService,
    private router: Router,
    private gtmService: GoogleTagManagerService
  ) {
  }

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
    const location = event.multimediaType ? '/multimedia' : '/reports';
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
    this.router.navigate(['/search'], {queryParams: {s: this.searchText}});
  }

  openDialog() {
    const dialogRef = this.dialog.open(EditPreferencesDialogComponent, {
      width: '350px',
      data: {},
      panelClass: 'custom-modalbox',
      autoFocus: false
    });

    dialogRef.afterClosed().subscribe((result: any) => {
      if (result && result.subscriber) {
        this.router.navigate(['/edit_confirmation']);
      }
    });
  }

  openQuincenalDialog() {
    const dialogRef = this.dialog.open(SubscribeDialogComponent, {
      width: '350px',
      data: {
        quincenal: true
      },
      panelClass: 'custom-modalbox',
      autoFocus: false
    });

    dialogRef.afterClosed().subscribe((result: any) => {
      if (result && result.subscriber) {
        this.router.navigate(['/sub2factor_confirmation']);
      }
    });
  }
}
