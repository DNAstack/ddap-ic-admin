import { NgModule } from '@angular/core';
import { DdapVisaPassportModule } from 'ddap-common-lib';

import { IdentityRoutingModule } from './identity-routing.module';
import { IdentityComponent } from './identity.component';
import { AccountSharedModule } from "../shared/shared.module";

@NgModule({
  declarations: [
    IdentityComponent,
  ],
  imports: [
    AccountSharedModule,
    IdentityRoutingModule,
    DdapVisaPassportModule,
  ],
})
export class IdentityModule { }
