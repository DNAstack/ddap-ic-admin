import { Component, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { FormValidationService } from 'ddap-common-lib';
import { ConfigModificationModel, EntityModel, SecretGeneratedDialogComponent } from 'ddap-common-lib';

import { IcConfigEntityFormComponentBase } from '../../shared/ic/ic-config-entity-form-component.base';
import { ClientApplicationFormComponent } from '../client-application-form/client-application-form.component';
import { ClientApplicationService } from '../client-applications.service';

@Component({
  selector: 'ddap-client-application-manage',
  templateUrl: './client-application-manage.component.html',
  styleUrls: ['./client-application-manage.component.scss'],
  providers: [FormValidationService],
})
export class ClientApplicationManageComponent extends IcConfigEntityFormComponentBase {

  @ViewChild(ClientApplicationFormComponent)
  clientForm: ClientApplicationFormComponent;

  constructor(
    protected route: ActivatedRoute,
    protected router: Router,
    protected validationService: FormValidationService,
    private dialog: MatDialog,
    private clientService: ClientApplicationService
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
