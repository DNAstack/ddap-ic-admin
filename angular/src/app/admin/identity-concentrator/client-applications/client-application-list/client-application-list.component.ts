import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute } from '@angular/router';
import { tap } from 'rxjs/operators';

import { IcConfigEntityListComponentBaseDirective } from '../../shared/ic/ic-config-entity-list-component-base.directive';
import { IcConfigStore } from '../../shared/ic/ic-config.store';
import { ClientApplicationService } from '../client-applications.service';
import { ClientApplicationsStore } from '../client-applications.store';

@Component({
  selector: 'ddap-client-application-list',
  templateUrl: './client-application-list.component.html',
  styleUrls: ['./client-application-list.component.scss'],
})
export class ClientApplicationListComponent
  extends IcConfigEntityListComponentBaseDirective<ClientApplicationsStore>
  implements OnInit {

  displayedColumns: string[] = [
    'label', 'description', 'clientId', 'scopes', 'redirectUris', 'grantTypes', 'responseTypes', 'moreActions',
  ];

  constructor(
    protected route: ActivatedRoute,
    protected icConfigStore: IcConfigStore,
    protected clientsStore: ClientApplicationsStore,
    protected dialog: MatDialog,
    private clientService: ClientApplicationService
  ) {
    super(icConfigStore, clientsStore, dialog);
  }

  protected delete(id: string): void {
    this.clientService.remove(id)
      .pipe(
        tap(() => this.icConfigStore.init())
      )
      .subscribe();
  }

}
