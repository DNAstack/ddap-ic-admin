import { NgModule } from '@angular/core';
import { DdapLayoutModule } from 'ddap-common-lib';

import { AdminSharedModule } from '../../admin/shared/shared.module';
import { AccountSharedModule } from '../shared/shared.module';

import { AuditlogDetailComponent } from './auditlog-detail/auditlog-detail.component';
import { AuditlogListComponent } from './auditlog-list/auditlog-list.component';
import { AuditlogsRoutingModule } from './auditlogs-routing.module';

@NgModule({
  declarations: [
    AuditlogListComponent,
    AuditlogDetailComponent,
  ],
  imports: [
    AuditlogsRoutingModule,
    DdapLayoutModule,
    AdminSharedModule,
    AccountSharedModule,
  ],
})
export class AuditlogsModule {

}
