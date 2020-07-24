import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { AuditlogDetailComponent } from './auditlog-detail/auditlog-detail.component';
import { AuditlogListComponent } from './auditlog-list/auditlog-list.component';

const routes = [
  {path: '', component: AuditlogListComponent},
  {path: ':auditlogId', component: AuditlogDetailComponent},
];
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AuditlogsRoutingModule {

}
