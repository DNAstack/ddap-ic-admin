import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { IcConfigEntityListComponentBaseDirective } from '../../shared/ic/ic-config-entity-list-component-base.directive';
import { IcConfigStore } from '../../shared/ic/ic-config.store';
import { ClientsStore } from '../clients.store';

@Component({
  selector: 'ddap-client-list',
  templateUrl: './client-list.component.html',
  styleUrls: ['./client-list.component.scss'],
})
export class ClientListComponent extends IcConfigEntityListComponentBaseDirective<ClientsStore> implements OnInit {

  displayedColumns: string[] = [
    'label', 'description', 'clientId', 'scopes', 'redirectUris', 'grantTypes', 'responseTypes', 'moreActions',
  ];

  constructor(protected route: ActivatedRoute,
              protected icConfigStore: IcConfigStore,
              protected clientsStore: ClientsStore) {
    super(icConfigStore, clientsStore);
  }

}
