import { Component, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { FormValidationService } from 'ddap-common-lib';
import { ConfigModificationModel, EntityModel, SecretGeneratedDialogComponent } from 'ddap-common-lib';

import { IcConfigEntityFormComponentBase } from '../../shared/ic/ic-config-entity-form-component.base';
import { ClientFormComponent } from '../client-form/client-form.component';
import { ClientService } from '../clients.service';

@Component({
  selector: 'ddap-client-manage',
  templateUrl: './client-manage.component.html',
  styleUrls: ['./client-manage.component.scss'],
  providers: [FormValidationService],
})
export class ClientManageComponent extends IcConfigEntityFormComponentBase {

  @ViewChild(ClientFormComponent)
  clientForm: ClientFormComponent;

  constructor(
    protected route: ActivatedRoute,
    protected router: Router,
    protected validationService: FormValidationService,
    private dialog: MatDialog,
    private clientService: ClientService
  ) {
    super(route, router, validationService);
  }

  save() {
    if (!this.validate(this.clientForm)) {
      return;
    }

    const client: EntityModel = this.clientForm.getModel();
    const change = new ConfigModificationModel(client.dto, {});
    this.clientService.save(client.name, change)
      .subscribe(
        (response) => {
          const secret = response.client_secret;
          if (secret) {
            this.openSecretGeneratedDialog(secret);
          } else {
            this.navigateUp('../..');
          }
        },
        this.showError
      );
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
          this.navigateUp('../..');
        }
      });
  }

}
