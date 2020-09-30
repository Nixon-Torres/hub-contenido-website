import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {ThankyouComponent} from './thankyou.component';
import {Routes, RouterModule} from '@angular/router';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {BreadcrumbModule} from '../breadcrumb/breadcrumb.module';

const routes: Routes = [
  {
    path: '',
    component: ThankyouComponent
  }
];

@NgModule({
  declarations: [ThankyouComponent],
    imports: [
        CommonModule,
        RouterModule.forChild(routes),
        FormsModule,
        ReactiveFormsModule,
        BreadcrumbModule
    ],
  entryComponents: []
})
export class ThankyouModule {
}
