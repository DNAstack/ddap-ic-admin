import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { AccountInfoFormComponent } from './account-info-form/account-info-form.component';
import { AccountInfoComponent } from './account-info/account-info.component';

export const routes: Routes = [
  { path: '', component: AccountInfoComponent},
  { path: 'edit', component: AccountInfoFormComponent},
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class InformationRoutingModule { }
