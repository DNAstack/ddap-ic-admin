import { Component, OnInit, ViewChild } from '@angular/core';
import { MatCheckboxChange } from '@angular/material/checkbox';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { FormValidationService, SecretGeneratedDialogComponent } from 'ddap-common-lib';
import { ConfigModificationModel, EntityModel } from 'ddap-common-lib';

import { IcConfigEntityDetailComponentBaseDirective } from '../../shared/ic/ic-config-entity-detail-component-base.directive';
import { IcConfigStore } from '../../shared/ic/ic-config.store';
import { ClientFormComponent } from '../client-form/client-form.component';
import { ClientService } from '../clients.service';
import { ClientsStore } from '../clients.store';

@Component({
  selector: 'ddap-client-detail',
  templateUrl: './client-detail.component.html',
  styleUrls: ['./client-detail.component.scss'],
  providers: [FormValidationService],
})
export class ClientDetailComponent extends IcConfigEntityDetailComponentBaseDirective<ClientsStore> implements OnInit {

  @ViewChild(ClientFormComponent)
  clientForm: ClientFormComponent;
  rotateSecret = false;

  constructor(
    protected route: ActivatedRoute,
    protected router: Router,
    protected validationService: FormValidationService,
    protected icConfigStore: IcConfigStore,
    protected clientsStore: ClientsStore,
    protected dialog: MatDialog,
    private clientService: ClientService
  ) {
    super(route, router, validationService, icConfigStore, clientsStore, dialog);
  }

  update() {
    if (!this.validate(this.clientForm)) {
      return;
    }

    const clientApplication: EntityModel = this.clientForm.getModel();
    const change = new ConfigModificationModel(clientApplication.dto, {});
    this.clientService.update(this.entity.name, change, this.rotateSecret)
      .subscribe((response) => {
        const clientSecret = response.client_secret;
        if (clientSecret) {
          this.openSecretGeneratedDialog(clientSecret);
        } else {
          this.navigateUp('..');
        }
      }, this.showError);
  }

  updateRotateSecret(event: MatCheckboxChange) {
    this.rotateSecret = event.checked;
  }

  openSecretGeneratedDialog(secretValue: string) {
    this.dialog.open(SecretGeneratedDialogComponent, {
      disableClose: true, // prevent closing dialog by clicking on backdrop
      data: {
        secretLabel: 'client secret',
        secretValue,
      },
    }).afterClosed()
      .subscribe(({ acknowledged }) => {
        if (acknowledged) {
          this.navigateUp('..');
        }
      });
  }

  protected delete() {
    this.clientService.remove(this.entity.name)
      .subscribe(() => this.navigateUp('..'), this.showError);
  }

}
