import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {ConfirmationComponent} from './confirmation.component';
import {Routes, RouterModule} from '@angular/router';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {BreadcrumbModule} from '../breadcrumb/breadcrumb.module';
import {PdfViewerModule} from 'ng2-pdf-viewer';
import {PipesModule} from '../../../pipes.module';
import {MatDividerModule} from '@angular/material';

const routes: Routes = [
  {
    path: '',
    component: ConfirmationComponent
  }
];

@NgModule({
  declarations: [ConfirmationComponent],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    FormsModule,
    ReactiveFormsModule,
    BreadcrumbModule,
    PdfViewerModule,
    PipesModule,
    MatDividerModule
  ],
  entryComponents: []
})
export class ConfirmationModule {
}
