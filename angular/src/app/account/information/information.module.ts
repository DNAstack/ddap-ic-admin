import { NgModule } from '@angular/core';
import { MatListModule } from '@angular/material/list';

import { AccountSharedModule } from '../shared/shared.module';

import { AccountInfoFormComponent } from './account-info-form/account-info-form.component';
import { AccountInfoComponent } from './account-info/account-info.component';
import { InformationRoutingModule } from './information-routing.module';

@NgModule({
  declarations: [
    AccountInfoComponent,
    AccountInfoFormComponent,
  ],
  imports: [
    AccountSharedModule,
    InformationRoutingModule,
    MatListModule,
  ],
})

export class InformationModule { }
