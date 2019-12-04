import { NgModule } from '@angular/core';

import { SharedModule } from '../../shared/shared.module';
import { MatExpansionModule } from "@angular/material/expansion";
import { MatIconModule } from "@angular/material/icon";
import { MatProgressBarModule } from "@angular/material/progress-bar";
import { MatCardModule } from "@angular/material/card";
import { MatButtonModule } from "@angular/material/button";
import { MatTooltipModule } from "@angular/material/tooltip";

@NgModule({
  declarations: [
  ],
  imports: [
    SharedModule,

    MatButtonModule,
    MatCardModule,
    MatExpansionModule,
    MatIconModule,
    MatProgressBarModule,
    MatTooltipModule,
  ],
  exports: [
    SharedModule,

    MatButtonModule,
    MatCardModule,
    MatExpansionModule,
    MatIconModule,
    MatProgressBarModule,
    MatTooltipModule,
  ],
})
export class AccountSharedModule { }
