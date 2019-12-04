import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { UserListComponent } from "./user-list/user-list.component";
import { ClientDetailComponent } from "../identity-concentrator/clients/client-detail/client-detail.component";
import { UserDetailComponent } from "./user-detail/user-detail.component";

export const routes: Routes = [
  { path: '', component: UserListComponent },
  { path: ':entityId', component: UserDetailComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class UsersRoutingModule { }
