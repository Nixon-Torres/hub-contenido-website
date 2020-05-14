import {Component, OnInit} from '@angular/core';
import {HttpService} from '../../../services/http.service';
import {environment} from '../../../../environments/environment';
import {DomSanitizer} from '@angular/platform-browser';
import {Observable} from 'rxjs';
import {map} from 'rxjs/operators';
import {FormBuilder} from '@angular/forms';

@Component({
  selector: 'app-preferences',
  templateUrl: './preferences.component.html',
  styleUrls: ['./preferences.component.scss']
})
export class PreferencesComponent implements OnInit {
  public breadcrumbItems: Array<any> = [{
    label: 'Preferencias',
    link: ['/preferences']
  }];

  public STORAGE_URL = environment.URL_API;
  public mainCategories;
  public categories;
  public selectedCategory;
  public selectedIdx;

  constructor(private http: HttpService, private sanitizer: DomSanitizer, private fb: FormBuilder) {
    /* this.form = this.fb.group({
      skills: this.buildSkills()
    }); */
  }

  public changeCategory(tab) {
    this.selectedCategory = this.categories[tab.index];
    this.selectedIdx = tab.index;
  }

  public nextCategory() {
    if (this.selectedIdx >= (this.mainCategories.length -1)) {
      return;
    }
    this.selectedIdx++;
    this.selectedCategory = this.mainCategories[this.selectedIdx];
  }

  public previousCategory() {
    if (this.selectedIdx <= 0) {
      return;
    }
    this.selectedIdx--;
    this.selectedCategory = this.mainCategories[this.selectedIdx];
  }

  private getCategories() {
    return this.http.get({
      path: `public/categories/`,
      data: {
        include: ['childrenMainReportTypes', 'childrenSubReportTypes']
      },
      encode: true
    }).subscribe((res) => {
      this.categories = res.body;
      this.mainCategories = this.categories.filter(e => !e.parentId);
      this.selectedCategory = this.categories[0];
    });
  }

  ngOnInit() {
    this.getCategories();
  }
}
