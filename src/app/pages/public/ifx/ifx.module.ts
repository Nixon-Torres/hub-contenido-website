import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {IfxComponent} from './ifx.component';
import {Routes, RouterModule} from '@angular/router';

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
    RouterModule.forChild(routes)
  ],
  entryComponents: [
  ]
})
export class IfxModule {
}
