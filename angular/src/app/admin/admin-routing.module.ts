import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: 'identity-concentrator',
    loadChildren: () => import('./identity-concentrator/identity-concentrator.module')
      .then(mod => mod.IdentityConcentratorModule),
  },
  {
    path: 'users',
    loadChildren: () => import('./users/users.module')
      .then(mod => mod.UsersModule),
  },
  {
    path: 'sessions',
    loadChildren: () => import('./tokens/tokens.module')
      .then(mod => mod.TokensModule),
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AdminRoutingModule { }
