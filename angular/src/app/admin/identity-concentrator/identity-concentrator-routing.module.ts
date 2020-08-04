import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

export const routes: Routes = [
  { path: '',
    children: [
      {
        path: 'client-applications',
        loadChildren: () => import('./client-applications/client-applications.module')
          .then(mod => mod.ClientApplicationsModule),
      },
      {
        path: 'identity-providers',
        loadChildren: () => import('./identity-providers/identity-providers.module')
          .then(mod => mod.IdentityProvidersModule),
      },
      {
        path: 'options',
        loadChildren: () => import('./options/options.module')
          .then(mod => mod.OptionsModule),
      },
    ]},
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class IdentityConcentratorRoutingModule { }
