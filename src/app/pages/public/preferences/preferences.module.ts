import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {PreferencesComponent} from './preferences.component';
import {Routes, RouterModule} from '@angular/router';
import {BreadcrumbModule} from '../breadcrumb/breadcrumb.module';
import {PipesModule} from '../../../pipes.module';
import {MatTabsModule} from '@angular/material';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {SubscribeDialogComponent} from '../subscribe-dialog/subscribe-dialog.component';

const routes: Routes = [
  {
    path: '',
    component: PreferencesComponent
  }
];

@NgModule({
  declarations: [PreferencesComponent],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    BreadcrumbModule,
    PipesModule,
    MatTabsModule,
    FormsModule,
    ReactiveFormsModule
  ],
  entryComponents: [
    SubscribeDialogComponent
  ]
})
export class PreferencesModule {
}
