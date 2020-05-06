import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {MultimediaDetailComponent} from './multimedia-detail.component';
import {Routes, RouterModule} from '@angular/router';
import {BreadcrumbModule} from '../breadcrumb/breadcrumb.module';
import {PipesModule} from '../../../pipes.module';

const routes: Routes = [
  {
    path: '',
    component: MultimediaDetailComponent
  }
];

@NgModule({
  declarations: [MultimediaDetailComponent],
    imports: [
        CommonModule,
        RouterModule.forChild(routes),
        BreadcrumbModule,
        PipesModule
    ],
  entryComponents: [
  ]
})
export class MultimediaDetailModule {
}
