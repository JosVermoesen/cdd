import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { HttpClientModule, HttpClient } from '@angular/common/http';
import { ReactiveFormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';

import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';
import { ButtonsModule } from 'ngx-bootstrap/buttons';
import { TabsModule } from 'ngx-bootstrap/tabs';
import { ModalModule, BsModalRef } from 'ngx-bootstrap/modal';

import { AppComponent } from './app.component';

import { LanguageService } from './services/language.service';
import { DomService } from './services/dom.service';
import { NavbarComponent } from './components/navbar/navbar.component';
import { LanguageComponent } from './components/navbar/language/language.component';
import { DomEntriesComponent } from './components/dom/domentries/domentries.component';
import { DomEntryComponent } from './components/dom/domentry/domentry.component';
import { DomExportComponent } from './components/dom/domexport/domexport.component';
import { DomSettingsComponent } from './components/dom/domsettings/domsettings.component';
import { DomSaveComponent } from './components/dom/domsave/domsave.component';
import { DomLoadComponent } from './components/dom/domload/domload.component';
import { DomToolsComponent } from './components/dom/domtools/domtools.component';

export function createTranslateLoader(http: HttpClient) {
  return new TranslateHttpLoader(http, 'assets/i18n/', '.json');
}

@NgModule({
  declarations: [
    AppComponent,
    NavbarComponent,
    LanguageComponent,
    DomEntryComponent,
    DomEntriesComponent,
    DomSettingsComponent,
    DomExportComponent,
    DomLoadComponent,
    DomSaveComponent,
    DomToolsComponent,
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    HttpClientModule,
    ReactiveFormsModule,
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: createTranslateLoader,
        deps: [HttpClient],
      },
    }),
    ButtonsModule.forRoot(),
    TabsModule.forRoot(),
    BsDatepickerModule.forRoot(),
    ModalModule.forRoot(),
  ],
  providers: [DomService, LanguageService, BsModalRef],
  entryComponents: [
    LanguageComponent,
    DomSettingsComponent,
    DomExportComponent,
    DomLoadComponent,
    DomSaveComponent,
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}

/* import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';

@NgModule({
  declarations: [AppComponent],
  imports: [BrowserModule],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {} */
