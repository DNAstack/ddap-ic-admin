import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatChipsModule } from '@angular/material/chips';
import { MatDialogModule } from '@angular/material/dialog';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatListModule } from '@angular/material/list';
import { MatMenuModule } from '@angular/material/menu';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatSelectModule } from '@angular/material/select';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatTableModule } from '@angular/material/table';
import { MatTooltipModule } from '@angular/material/tooltip';
import { RouterModule } from '@angular/router';
import { NgJsonEditorModule } from 'ang-jsoneditor';
import { DdapLayoutModule, MenuModule } from 'ddap-common-lib';

import { LayoutComponent } from './layout/layout.component';
import { PersonalInfoFormComponent } from './users/personal-info-form/personal-info-form.component';
import {
  UserAccountCloseConfirmationDialogComponent
} from './users/user-account-close-confirmation-dialog/user-account-close-confirmation-dialog.component';
import { AuditlogDetailComponent } from './users/user-auditlogs/auditlog-detail/auditlog-detail.component';
import { AuditlogTableComponent } from './users/user-auditlogs/auditlog-table/auditlog-table.component';
import { ConsentTableComponent } from './users/user-consents/consent-table/consent-table.component';
import { SessionTableComponent } from './users/user-sessions/session-table/session-table.component';

@NgModule({
  declarations: [
    LayoutComponent,
    PersonalInfoFormComponent,
    UserAccountCloseConfirmationDialogComponent,
    ConsentTableComponent,
    SessionTableComponent,
    AuditlogTableComponent,
    AuditlogDetailComponent,
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
    MatMenuModule,
    MatTableModule,

    DdapLayoutModule,
    MenuModule,
    MatMenuModule,
    MatChipsModule,
    MatSelectModule,
    NgJsonEditorModule,
    MatCardModule,
    MatAutocompleteModule,
  ],
  exports: [
    CommonModule,
    RouterModule,
    FormsModule,
    ReactiveFormsModule,

    MatSnackBarModule,
    MatMenuModule,
    MatTableModule,

    DdapLayoutModule,
    PersonalInfoFormComponent,
    ConsentTableComponent,
    SessionTableComponent,
    AuditlogTableComponent,
    AuditlogDetailComponent,
  ],
})
export class SharedModule {
}
