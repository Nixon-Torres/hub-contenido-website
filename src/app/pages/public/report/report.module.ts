import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReportComponent } from './report.component';
import { Routes, RouterModule } from '@angular/router';
import {BreadcrumbModule} from '../breadcrumb/breadcrumb.module';

const routes: Routes = [
  {
    path: '',
    component: ReportComponent
  }
];


@NgModule({
  declarations: [ReportComponent],
    imports: [
        CommonModule,
        RouterModule.forChild(routes),
        BreadcrumbModule
    ],
  entryComponents: [
  ]
})
export class ReportModule { }
