import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {IfxComponent} from './ifx.component';
import {Routes, RouterModule} from '@angular/router';
import {BreadcrumbModule} from '../breadcrumb/breadcrumb.module';

const routes: Routes = [
  {
    path: '',
    component: IfxComponent
  }
];

@NgModule({
  declarations: [IfxComponent],
    imports: [
        CommonModule,
        RouterModule.forChild(routes),
        BreadcrumbModule
    ],
  entryComponents: [
  ]
})
export class IfxModule {
}
