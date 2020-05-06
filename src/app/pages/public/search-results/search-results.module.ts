import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {SearchResultsComponent} from './search-results.component';
import {Routes, RouterModule} from '@angular/router';

import { NgSelectModule } from '@ng-select/ng-select';
import { FormsModule } from '@angular/forms';

import { MatFormFieldModule, MatInputModule, MatDatepickerModule, MatNativeDateModule } from '@angular/material';
import {PipesModule} from '../../../pipes.module';

const routes: Routes = [
  {
    path: '',
    component: SearchResultsComponent
  }
];

@NgModule({
  declarations: [SearchResultsComponent],
  imports: [
    CommonModule,
    NgSelectModule,
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatNativeDateModule,
    MatDatepickerModule,
    RouterModule.forChild(routes),
    PipesModule
  ],
  entryComponents: [
  ]
})
export class SearchResultsModule {
}
