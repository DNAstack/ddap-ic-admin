import { Injectable } from '@angular/core';
import { ViewControllerService } from 'ddap-common-lib';

@Injectable({
  providedIn: 'root',
})
export class AppConfigService {
  constructor(public viewControllerService: ViewControllerService) {
    this.registerModules();
  }

  private registerModules() {
    this.viewControllerService.registerGroup({
      key: 'user-admin',
      name: 'User Administration',
      collapsible: true,
      collapsibleByDefault: true,
    })
    .registerGroup({
      key: 'ic-admin',
      name: 'Identity Concentrator Administration',
      collapsible: false,
      collapsibleByDefault: false,
    });

    this.viewControllerService.registerModule({
      key: 'my-identity',
      name: 'My Identity',
      iconClasses: 'icon icon-identity',
      routerLink: 'account/identity',
      isApp: false,
    })
    .registerModule({
      key: 'admin-users',
      name: 'Users',
      iconClasses: 'icon icon-identities',
      routerLink: 'admin/users',
      isApp: false,
      group: 'user-admin',
    })
    .registerModule({
      key: 'admin-sessions',
      name: 'Sessions',
      iconClasses: 'icon icon-clients',
      routerLink: 'admin/sessions',
      isApp: false,
      group: 'user-admin',
    })
    .registerModule({
      key: 'admin-consents',
      name: 'Consents',
      iconClasses: 'icon icon-passport',
      routerLink: 'admin/consents',
      isApp: false,
      group: 'user-admin',
    })
    .registerModule({
      key: 'ic-admin-identity-providers',
      name: 'Identity Providers',
      iconClasses: 'icon icon-identities',
      routerLink: 'admin/identity-concentrator/identity-providers',
      isApp: false,
      group: 'ic-admin',
    })
    .registerModule({
      key: 'ic-admin-clients',
      name: 'Clients',
      iconClasses: 'icon icon-apps',
      routerLink: 'admin/identity-concentrator/clients',
      isApp: false,
      group: 'ic-admin',
    })
    .registerModule({
      key: 'ic-admin-options',
      name: 'Options',
      iconClasses: 'icon icon-settings',
      routerLink: 'admin/identity-concentrator/options',
      isApp: false,
      group: 'ic-admin',
    });
  }
}
