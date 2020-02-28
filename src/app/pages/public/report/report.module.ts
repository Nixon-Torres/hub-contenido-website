import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReportComponent } from './report.component';
import { Routes, RouterModule } from '@angular/router';
import { IndicatorComponent } from '../indicator/indicator.component';
import { RemarkableAreaComponent } from '../remarkable-area/remarkable-area.component';
import { MultimediaGalleryComponent } from '../multimedia-gallery/multimedia-gallery.component';
import { ContactFormComponent } from '../contact-form/contact-form.component';
import { ReportSummaryComponent } from '../report-summary/report-summary.component';
import { SideBarComponent } from '../remarkable-area/side-bar/side-bar.component';

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
    RouterModule.forChild(routes)
  ],
  entryComponents: [
  ]
})
export class ReportModule { }
