import { NgModule } from '@angular/core';

import { AccountSharedModule } from '../shared/shared.module';

import { ConnectedAccountsSectionComponent } from './connected-accounts-section/connected-accounts-section.component';
import { IdentityRoutingModule } from './identity-routing.module';
import { IdentityComponent } from './identity.component';
import { ClaimGroupComponent } from './visa-passports/claim-group/claim-group.component';

@NgModule({
  declarations: [
    ClaimGroupComponent,
    ConnectedAccountsSectionComponent,
    IdentityComponent,
  ],
  imports: [
    AccountSharedModule,
    IdentityRoutingModule,
  ],
})
export class IdentityModule { }
