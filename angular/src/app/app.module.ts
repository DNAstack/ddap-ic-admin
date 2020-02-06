import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { LoadingBarHttpClientModule } from '@ngx-loading-bar/http-client';

import {
  UserAccountCloseConfirmationDialogComponent
} from './shared/users/user-account-close-confirmation-dialog/user-account-close-confirmation-dialog.component';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import {
  RealmChangeConfirmationDialogComponent
} from './shared/realm/realm-change-confirmation-dialog/realm-change-confirmation-dialog.component';
import { SharedModule } from './shared/shared.module';

@NgModule({
  declarations: [
    AppComponent,
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    HttpClientModule,
    LoadingBarHttpClientModule,

    SharedModule,
    AppRoutingModule,
  ],
  entryComponents: [
    RealmChangeConfirmationDialogComponent,
    UserAccountCloseConfirmationDialogComponent,
  ],
  bootstrap: [AppComponent],
})
export class AppModule { }
