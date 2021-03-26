import { BrowserModule } from '@angular/platform-browser';
import {CUSTOM_ELEMENTS_SCHEMA, LOCALE_ID, NgModule} from '@angular/core';
import { registerLocaleData } from '@angular/common';

import { HttpClientModule } from '@angular/common/http';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { LayoutComponent } from './layout/layout.component';
import { HeaderComponent } from './layout/header/header.component';
import { FooterComponent } from './layout/footer/footer.component';
import { TopMenuComponent } from './layout/top-menu/top-menu.component';
import { ThankyouComponent } from './pages/public/thankyou/thankyou.component';
import { NgSelectModule } from '@ng-select/ng-select';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import { PdfViewerModule } from 'ng2-pdf-viewer';

import localeCo from '@angular/common/locales/es-CO';
import {HomeModule} from './pages/public/home/home.module';
import {PipesModule} from './pipes.module';

import '../../pdf-viewer';
import {PreferencesModule} from './pages/public/preferences/preferences.module';
import {MatDialogModule, MatDividerModule} from '@angular/material';
import {SubscribeDialogComponent} from './pages/public/subscribe-dialog/subscribe-dialog.component';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatSelectModule} from '@angular/material/select';
import {EditPreferencesDialogComponent} from './pages/public/edit-preferences-dialog/edit-preferences-dialog.component';
import {InvestPreferencesDialogComponent} from './pages/public/invest-preferences-dialog/invest-preferences-dialog.component';
import {RunScriptsDirective} from './run-scripts.directive';

registerLocaleData(localeCo, 'es-CO');

@NgModule({
  declarations: [
    AppComponent,
    LayoutComponent,
    HeaderComponent,
    FooterComponent,
    TopMenuComponent,
    SubscribeDialogComponent,
    EditPreferencesDialogComponent,
    InvestPreferencesDialogComponent,
    RunScriptsDirective,
    ThankyouComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    HttpClientModule,
    NgSelectModule,
    FormsModule,
    PdfViewerModule,
    HomeModule,
    PreferencesModule,
    PipesModule,
    MatDialogModule,
    MatFormFieldModule,
    MatSelectModule,
    ReactiveFormsModule,
    MatDividerModule
  ],
  entryComponents: [
    EditPreferencesDialogComponent
  ],
  providers: [
    {provide: LOCALE_ID, useValue: 'es-CO'},
    {provide: 'googleTagManagerId', useValue: 'GTM-KD77KT3'}],
  exports: [
    SubscribeDialogComponent,
    EditPreferencesDialogComponent,
    InvestPreferencesDialogComponent,
    RunScriptsDirective
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  bootstrap: [AppComponent]
})
export class AppModule { }
