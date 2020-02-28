import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatDialogModule } from '@angular/material/dialog';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatListModule } from '@angular/material/list';
import { MatMenuModule } from '@angular/material/menu';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatTooltipModule } from '@angular/material/tooltip';
import { RouterModule } from '@angular/router';
import { DdapLayoutModule, MenuModule } from 'ddap-common-lib';

import { LayoutComponent } from './layout/layout.component';
import { PersonalInfoFormComponent } from './users/personal-info-form/personal-info-form.component';
import {
  UserAccountCloseConfirmationDialogComponent
} from './users/user-account-close-confirmation-dialog/user-account-close-confirmation-dialog.component';

@NgModule({
  declarations: [
    LayoutComponent,
    PersonalInfoFormComponent,
    UserAccountCloseConfirmationDialogComponent,
  ],
  imports: [
    CommonModule,
    RouterModule,
    FormsModule,
    ReactiveFormsModule,

    MatButtonModule,
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
    MenuModule,
    MenuModule,
    MatMenuModule,
  ],
  exports: [
    CommonModule,
    RouterModule,
    FormsModule,
    ReactiveFormsModule,

    MatSnackBarModule,

    DdapLayoutModule,
    PersonalInfoFormComponent,
  ],
})
export class SharedModule {
}
