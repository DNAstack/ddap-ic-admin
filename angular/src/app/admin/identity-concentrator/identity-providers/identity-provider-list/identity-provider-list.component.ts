import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute } from '@angular/router';
import { tap } from 'rxjs/operators';

import { IcConfigEntityListComponentBaseDirective } from '../../shared/ic/ic-config-entity-list-component-base.directive';
import { IcConfigStore } from '../../shared/ic/ic-config.store';
import { IdentityProviderService } from '../identity-providers.service';
import { IdentityProvidersStore } from '../identity-providers.store';

@Component({
  selector: 'ddap-identity-provider-list',
  templateUrl: './identity-provider-list.component.html',
  styleUrls: ['./identity-provider-list.component.scss'],
})
export class IdentityProviderListComponent
  extends IcConfigEntityListComponentBaseDirective<IdentityProvidersStore>
  implements OnInit {

  displayedColumns: string[] = [
    'label', 'description', 'clientId', 'scopes', 'responseType', 'issuer', 'authorizeUrl', 'tokenUrl', 'moreActions',
  ];

  constructor(
    protected route: ActivatedRoute,
    protected icConfigStore: IcConfigStore,
    protected identityProvidersStore: IdentityProvidersStore,
    protected dialog: MatDialog,
    private identityProviderService: IdentityProviderService
  ) {
    super(icConfigStore, identityProvidersStore, dialog);
  }

  protected delete(id: string): void {
    this.identityProviderService.remove(id)
      .pipe(
        tap(() => this.icConfigStore.init())
      )
      .subscribe();
  }

}
