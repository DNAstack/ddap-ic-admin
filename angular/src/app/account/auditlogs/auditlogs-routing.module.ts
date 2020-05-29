import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { AuditlogDetailComponent } from './auditlog-detail/auditlog-detail.component';
import { AuditlogsListComponent } from './auditlogs-list/auditlogs-list.component';

const routes = [
  {path: '', component: AuditlogsListComponent},
  {path: ':auditlogId', component: AuditlogDetailComponent},
];
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AuditlogsRoutingModule {

}
