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
      name: 'My Profile & Activity',
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

    this.viewControllerService
      .registerModule({
      key: 'identity-admin',
      name: 'Profile',
      iconClasses: 'icon icon-profile',
      routerLink: 'account/identity',
      isApp: false,
      group: 'identity-admin',
      nonAdmin: true,
    })
      .registerModule({
        key: 'sessions',
        name: 'Sessions',
        iconClasses: 'icon icon-session',
        routerLink: 'account/sessions',
        isApp: false,
        group: 'identity-admin',
        nonAdmin: true,
      })
      .registerModule({
        key: 'consents',
        name: 'Remembered Consents',
        iconClasses: 'icon icon-consent',
        routerLink: 'account/consents',
        isApp: false,
        group: 'identity-admin',
        nonAdmin: true,
      })
      .registerModule({
        key: 'auditlogs',
        name: 'Audit Logs',
        iconClasses: 'icon icon-audit',
        routerLink: 'account/auditlogs',
        isApp: false,
        group: 'identity-admin',
        nonAdmin: true,
      })
      .registerModule({
        key: 'admin-users',
        name: 'Users',
        iconClasses: 'icon icon-users',
        routerLink: 'admin/users',
        isApp: false,
        group: 'user-admin',
        nonAdmin: false,
      })
      .registerModule({
        key: 'ic-admin-identity-providers',
        name: 'Identity Providers',
        iconClasses: 'icon icon-id-providers',
        routerLink: 'admin/identity-concentrator/identity-providers',
        isApp: false,
        group: 'ic-admin',
        nonAdmin: false,
      })
      .registerModule({
        key: 'ic-admin-clients',
        name: 'Client Applications',
        iconClasses: 'icon icon-apps',
        routerLink: 'admin/identity-concentrator/client-applications',
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
