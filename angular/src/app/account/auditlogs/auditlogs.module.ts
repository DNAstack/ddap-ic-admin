import { NgModule } from '@angular/core';
import { MatChipsModule } from '@angular/material/chips';
import { NgJsonEditorModule } from 'ang-jsoneditor';
import { DdapLayoutModule } from 'ddap-common-lib';

import { AdminSharedModule } from '../../admin/shared/shared.module';
import { AccountSharedModule } from '../shared/shared.module';

import { AuditlogDetailComponent } from './auditlog-detail/auditlog-detail.component';
import { AuditlogsListComponent } from './auditlogs-list/auditlogs-list.component';
import { AuditlogsRoutingModule } from './auditlogs-routing.module';

@NgModule({
  declarations: [
    AuditlogsListComponent,
    AuditlogDetailComponent,
  ],
  imports: [
    AuditlogsRoutingModule,
    DdapLayoutModule,
    AdminSharedModule,
    AccountSharedModule,
    MatChipsModule,
    NgJsonEditorModule,
  ],
})
export class AuditlogsModule {

}
