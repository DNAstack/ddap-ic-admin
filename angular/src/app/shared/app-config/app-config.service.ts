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
      key: 'identity-admin',
      name: 'Identity Management',
      collapsible: true,
      collapsibleByDefault: true,
      nonAdmin: true,
    })
      .registerGroup({
        key: 'user-admin',
        name: 'User Administration',
        collapsible: true,
        collapsibleByDefault: true,
        nonAdmin: false,
      })
      .registerGroup({
        key: 'ic-admin',
        name: 'Identity Concentrator Administration',
        collapsible: false,
        collapsibleByDefault: false,
        nonAdmin: false,
      });

    this.viewControllerService.registerModule({
      key: 'identity-admin',
      name: 'My Identity',
      iconClasses: 'icon icon-identity',
      routerLink: 'account/identity',
      isApp: false,
      group: 'identity-admin',
      nonAdmin: true,
    })
      .registerModule({
        key: 'sessions',
        name: 'Sessions',
        iconClasses: 'icon icon-clients',
        routerLink: 'account/sessions',
        isApp: false,
        group: 'identity-admin',
        nonAdmin: true,
      })
      .registerModule({
        key: 'consents',
        name: 'Consents',
        iconClasses: 'icon icon-passport',
        routerLink: 'account/consents',
        isApp: false,
        group: 'identity-admin',
        nonAdmin: true,
      })
      .registerModule({
        key: 'auditlogs',
        name: 'Auditlogs',
        iconClasses: 'icon icon-rules',
        routerLink: 'account/auditlogs',
        isApp: false,
        group: 'identity-admin',
        nonAdmin: true,
      })
      .registerModule({
        key: 'admin-users',
        name: 'Users',
        iconClasses: 'icon icon-identities',
        routerLink: 'admin/users',
        isApp: false,
        group: 'user-admin',
        nonAdmin: false,
      })
      .registerModule({
        key: 'ic-admin-identity-providers',
        name: 'Identity Providers',
        iconClasses: 'icon icon-identities',
        routerLink: 'admin/identity-concentrator/identity-providers',
        isApp: false,
        group: 'ic-admin',
        nonAdmin: false,
      })
      .registerModule({
        key: 'ic-admin-clients',
        name: 'Clients',
        iconClasses: 'icon icon-apps',
        routerLink: 'admin/identity-concentrator/clients',
        isApp: false,
        group: 'ic-admin',
        nonAdmin: false,
      })
      .registerModule({
        key: 'ic-admin-options',
        name: 'Options',
        iconClasses: 'icon icon-settings',
        routerLink: 'admin/identity-concentrator/options',
        isApp: false,
        group: 'ic-admin',
        nonAdmin: false,
      });
  }
}
