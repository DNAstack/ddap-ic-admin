import { NgModule } from '@angular/core';
import { MAT_CHECKBOX_CLICK_ACTION } from '@angular/material/checkbox';
import { NgJsonEditorModule } from 'ang-jsoneditor';
import { DdapAdminModule, DdapFormModule } from "ddap-common-lib";

import { SharedModule } from '../../shared/shared.module';
import { MatExpansionModule } from "@angular/material/expansion";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatInputModule } from "@angular/material/input";
import { MatButtonModule } from "@angular/material/button";
import { MatIconModule } from "@angular/material/icon";
import { MatProgressBarModule } from "@angular/material/progress-bar";
import { MatSelectModule } from "@angular/material/select";

@NgModule({
  declarations: [
  ],
  imports: [
    SharedModule,
    DdapAdminModule,
    DdapFormModule,
    NgJsonEditorModule,

    MatButtonModule,
    MatExpansionModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
    MatProgressBarModule,
    MatSelectModule,
  ],
  exports: [
    SharedModule,
    DdapAdminModule,
    DdapFormModule,
    NgJsonEditorModule,

    MatButtonModule,
    MatExpansionModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
    MatProgressBarModule,
    MatSelectModule,
  ],
  providers: [
    { provide: MAT_CHECKBOX_CLICK_ACTION, useValue: 'check-indeterminate' },
  ],
})
export class AdminSharedModule { }
