import { NgModule } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MAT_CHECKBOX_CLICK_ACTION } from '@angular/material/checkbox';
import { MatDividerModule } from '@angular/material/divider';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatSelectModule } from '@angular/material/select';
import { NgJsonEditorModule } from 'ang-jsoneditor';
import { DdapAdminModule, DdapFormModule } from 'ddap-common-lib';

import { SharedModule } from '../../shared/shared.module';

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
    MatDividerModule,
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
    MatDividerModule,
  ],
  providers: [
    { provide: MAT_CHECKBOX_CLICK_ACTION, useValue: 'check-indeterminate' },
  ],
})
export class AdminSharedModule { }
