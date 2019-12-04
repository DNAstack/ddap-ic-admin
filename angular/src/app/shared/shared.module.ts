import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatDialogModule } from '@angular/material/dialog';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatListModule } from '@angular/material/list';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { RouterModule } from '@angular/router';
import { DdapLayoutModule } from 'ddap-common-lib';

import {
  RealmChangeConfirmationDialogComponent
} from './realm/realm-change-confirmation-dialog/realm-change-confirmation-dialog.component';
import { RealmInputComponent } from './realm/realm-input/realm-input.component';
import { LayoutComponent } from "./layout/layout.component";
import { MatTooltipModule } from "@angular/material/tooltip";
import { PersonalInfoFormComponent } from "./users/personal-info-form/personal-info-form.component";
import { MatCheckboxModule } from "@angular/material/checkbox";

@NgModule({
  declarations: [
    LayoutComponent,
    PersonalInfoFormComponent,
    RealmInputComponent,
    RealmChangeConfirmationDialogComponent,
  ],
  imports: [
    CommonModule,
    RouterModule,
    FormsModule,
    ReactiveFormsModule,

    MatCheckboxModule,
    MatDialogModule,
    MatExpansionModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
    MatListModule,
    MatProgressBarModule,
    MatSidenavModule,
    MatSnackBarModule,
    MatTooltipModule,

    DdapLayoutModule,
  ],
  exports: [
    CommonModule,
    RouterModule,
    FormsModule,
    ReactiveFormsModule,

    MatSnackBarModule,

    DdapLayoutModule,
    PersonalInfoFormComponent,
    RealmInputComponent,
  ],
})
export class SharedModule {
}
