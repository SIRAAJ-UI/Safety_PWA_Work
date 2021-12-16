import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';

// used to create fake backend
import { ModalModule } from 'ngx-bootstrap/modal';
import { AppRoutingModule } from './app-routing.module';
import { JwtInterceptor, ErrorInterceptor } from './_helpers';
import { AppComponent } from './app.component';
import { AlertComponent } from './_components';
import { LoginComponent } from './_components/login/login.component';

import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { SafetyModule } from './safety/safety.module';
import { DBConfig, NgxIndexedDBModule } from 'ngx-indexed-db';
/** BlockUIModule */
import { BlockUIModule } from 'ng-block-ui';
import { BlockTemplateCmp } from './_components/block-template/block-template.component';

import { NgSelectModule } from '@ng-select/ng-select';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';;
import { ServiceWorkerModule } from '@angular/service-worker';
import { environment } from '../environments/environment';
import { ConnectionService } from 'ng-connection-service';;
import { NavbarComponent } from './navbar/navbar.component';
import { SafetyReportPageComponent } from './safety-report-page/safety-report-page.component'

const dbConfig: DBConfig = {
  name: 'SAFETY_REPORTS',
  version: 1,
  objectStoresMeta: [
    {
      store: 'OFFLINE_RECORDS',
      storeConfig: { keyPath: 'id', autoIncrement: true },
      storeSchema: [
        { name: 'ReportTypes', keypath: 'ReportTypes', options: { unique: true } },
        { name: 'Classes', keypath: 'Classes', options: { unique: true } },
        { name: 'ReportedBy', keypath: 'ReportedBy', options: { unique: true } },
        { name: 'AreaLines', keypath: 'AreaLines', options: { unique: true } },
      ]
    }, {
      store: 'OFFLINE_SAVE_RECORDS',
      storeConfig: { keyPath: 'id', autoIncrement: true },
      storeSchema: [
        { name: 'SaveSafetyRecords', keypath: 'SaveSafetyRecords', options: { unique: false } },
      ]
    }
  ]
};


@NgModule({
  imports: [
    BrowserModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    AppRoutingModule,
    SafetyModule,
    NgSelectModule,
    ModalModule.forRoot(),
    NgxIndexedDBModule.forRoot(dbConfig),
    NgbModule,
    BlockUIModule.forRoot({ template: BlockTemplateCmp }),
    ServiceWorkerModule.register('ngsw-worker.js', { enabled: environment.production })
  ],
  declarations: [
    AppComponent,
    AlertComponent,
    BlockTemplateCmp,
    LoginComponent,
    NavbarComponent,
    SafetyReportPageComponent
  ],
  entryComponents: [
     BlockTemplateCmp
  ],
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: JwtInterceptor, multi: true },
    { provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptor, multi: true },
    ConnectionService,
    // provider used to create fake backend
    // fakeBackendProvider
  ],
  bootstrap: [AppComponent]
})
export class AppModule { };