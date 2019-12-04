import { NgModule } from '@angular/core';

import { UsersRoutingModule } from './users-routing.module';
import { AdminSharedModule } from "../shared/shared.module";
import { UserListComponent } from "./user-list/user-list.component";
import { DdapFormModule } from "ddap-common-lib";
import { UserDetailComponent } from "./user-detail/user-detail.component";

@NgModule({
  declarations: [
    UserDetailComponent,
    UserListComponent,
  ],
  imports: [
    AdminSharedModule,
    UsersRoutingModule,

    DdapFormModule,
  ],
})
export class UsersModule {

}