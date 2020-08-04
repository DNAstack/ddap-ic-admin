import { NgModule } from '@angular/core';
import { MatTooltipModule } from '@angular/material/tooltip';

import { AdminSharedModule } from '../../shared/shared.module';

@NgModule({
  declarations: [

  ],
  imports: [
    AdminSharedModule,
    MatTooltipModule,
  ],
  exports: [
    AdminSharedModule,
    MatTooltipModule,
  ],
})
export class IdentityConcentratorSharedModule { }
