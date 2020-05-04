import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {MultimediaComponent} from './multimedia.component';
import {Routes, RouterModule} from '@angular/router';
import {BreadcrumbModule} from '../breadcrumb/breadcrumb.module';

const routes: Routes = [
  {
    path: '',
    component: MultimediaComponent
  }
];

@NgModule({
  declarations: [MultimediaComponent],
    imports: [
        CommonModule,
        RouterModule.forChild(routes),
        BreadcrumbModule
    ],
  entryComponents: [
  ]
})
export class MultimediaModule {
}
