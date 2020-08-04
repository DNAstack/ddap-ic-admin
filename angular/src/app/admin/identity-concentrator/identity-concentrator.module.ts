import { NgModule } from '@angular/core';

import { AdminSharedModule } from '../shared/shared.module';

import { IdentityConcentratorRoutingModule } from './identity-concentrator-routing.module';

@NgModule({
  declarations: [

  ],
  imports: [
    AdminSharedModule,
    IdentityConcentratorRoutingModule,
  ],
})
export class IdentityConcentratorModule {

}
