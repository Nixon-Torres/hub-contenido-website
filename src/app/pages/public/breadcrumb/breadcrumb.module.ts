import {NgModule} from '@angular/core';

import {BreadcrumbComponent} from '../breadcrumb/breadcrumb.component';
import {RouterModule} from '@angular/router';
import {CommonModule} from '@angular/common';

@NgModule({
  declarations: [BreadcrumbComponent],
    imports: [
        RouterModule,
        CommonModule
    ],
  entryComponents: [
  ],
  exports: [BreadcrumbComponent]
})
export class BreadcrumbModule {
}

