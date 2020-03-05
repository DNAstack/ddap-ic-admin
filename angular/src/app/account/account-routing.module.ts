import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

export const routes: Routes = [
  { path: '',
    children: [
      {
        path: 'identity',
        loadChildren: () => import('./identity/identity.module')
          .then(mod => mod.IdentityModule),
      },
      {
        path: 'sessions',
        loadChildren: () => import('../account/tokens/tokens.module')
          .then(mod => mod.TokensModule),
      },
      {
        path: 'consents',
        loadChildren: () => import('../account/consents/consents.module')
          .then(mod => mod.ConsentsModule),
      },
    ]},
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AccountRoutingModule { }
