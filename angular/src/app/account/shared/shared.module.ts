import { NgModule } from '@angular/core';

import { SharedModule } from '../../shared/shared.module';
import { MatExpansionModule } from "@angular/material/expansion";
import { MatIconModule } from "@angular/material/icon";
import { MatProgressBarModule } from "@angular/material/progress-bar";
import { MatCardModule } from "@angular/material/card";

@NgModule({
  declarations: [
  ],
  imports: [
    SharedModule,

    MatCardModule,
    MatExpansionModule,
    MatIconModule,
    MatProgressBarModule,
  ],
  exports: [
    SharedModule,

    MatCardModule,
    MatExpansionModule,
    MatIconModule,
    MatProgressBarModule,
  ],
})
export class AccountSharedModule { }
