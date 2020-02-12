import { NgModule } from '@angular/core';
import { DdapVisaPassportModule } from 'ddap-common-lib';

import { IdentityRoutingModule } from './identity-routing.module';
import { IdentityComponent } from './identity.component';
import { AccountSharedModule } from "../shared/shared.module";
import { ConnectedAccountsSectionComponent } from "./connected-accounts-section/connected-accounts-section.component";

@NgModule({
  declarations: [
    IdentityComponent,
    ConnectedAccountsSectionComponent,
  ],
  imports: [
    AccountSharedModule,
    IdentityRoutingModule,
    DdapVisaPassportModule,
  ],
})
export class IdentityModule { }
