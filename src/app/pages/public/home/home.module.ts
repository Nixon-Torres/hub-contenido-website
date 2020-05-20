import {NgModule, Pipe} from '@angular/core';
import {CommonModule} from '@angular/common';
import {HomeComponent} from './home.component';
import {Routes, RouterModule} from '@angular/router';
import {IndicatorComponent} from '../indicator/indicator.component';
import {RemarkableAreaComponent} from '../remarkable-area/remarkable-area.component';
import {MultimediaGalleryComponent} from '../multimedia-gallery/multimedia-gallery.component';
import {ContactFormComponent} from '../contact-form/contact-form.component';
import {ReportSummaryComponent} from '../report-summary/report-summary.component';
import {SideBarComponent} from '../remarkable-area/side-bar/side-bar.component';
import {HowIsEconomyComponent} from '../how-is-economy/how-is-economy.component';
import {PipesModule} from '../../../pipes.module';
import {EditPreferencesDialogComponent} from '../edit-preferences-dialog/edit-preferences-dialog.component';

const routes: Routes = [
  {
    path: '',
    component: HomeComponent
  }
];

@NgModule({
  declarations: [HomeComponent, IndicatorComponent, RemarkableAreaComponent, MultimediaGalleryComponent, ContactFormComponent, ReportSummaryComponent, SideBarComponent, HowIsEconomyComponent],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    PipesModule
  ],
  exports: [
  ],
  entryComponents: [
    IndicatorComponent,
    RemarkableAreaComponent,
    MultimediaGalleryComponent,
    ContactFormComponent,
    ReportSummaryComponent
  ]
})
export class HomeModule {
}
