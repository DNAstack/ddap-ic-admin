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
        loadChildren: () => import('./tokens/tokens.module')
          .then(mod => mod.TokensModule),
      },
      {
        path: 'info',
        loadChildren: () => import('./information/information.module')
          .then(mod => mod.InformationModule),
      },
    ]},
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AccountRoutingModule { }
