import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {MultimediaComponent} from './multimedia.component';
import {Routes, RouterModule} from '@angular/router';

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
    RouterModule.forChild(routes)
  ],
  entryComponents: [
  ]
})
export class MultimediaModule {
}
