import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {CategoriesComponent} from './categories.component';
import {Routes, RouterModule} from '@angular/router';

import { NgSelectModule } from '@ng-select/ng-select';
import { FormsModule } from '@angular/forms';

import { MatFormFieldModule, MatInputModule, MatDatepickerModule, MatNativeDateModule } from '@angular/material';
import {BreadcrumbModule} from '../breadcrumb/breadcrumb.module';

const routes: Routes = [
  {
    path: '',
    component: CategoriesComponent
  }
];

@NgModule({
  declarations: [CategoriesComponent],
    imports: [
        CommonModule,
        NgSelectModule,
        FormsModule,
        MatFormFieldModule,
        MatInputModule,
        MatNativeDateModule,
        MatDatepickerModule,
        BreadcrumbModule,
        RouterModule.forChild(routes)
    ],
  entryComponents: [
  ]
})
export class CategoriesModule {
}
