import {NgModule} from '@angular/core';

import {StripHtmlPipe} from './striphtml.pipe';
import {TruncatePipe} from './truncate.pipe';

@NgModule({
  declarations: [StripHtmlPipe, TruncatePipe],
  imports: [
  ],
  exports: [
    StripHtmlPipe,
    TruncatePipe
  ],
  entryComponents: [
  ]
})
export class PipesModule {
}
