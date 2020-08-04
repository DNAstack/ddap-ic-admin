import { Component, OnInit, ViewChild } from '@angular/core';
import { MatCheckboxChange } from '@angular/material/checkbox';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { FormValidationService, SecretGeneratedDialogComponent } from 'ddap-common-lib';
import { ConfigModificationModel, EntityModel } from 'ddap-common-lib';

import { IcConfigEntityDetailComponentBaseDirective } from '../../shared/ic/ic-config-entity-detail-component-base.directive';
import { IcConfigStore } from '../../shared/ic/ic-config.store';
import { ClientApplicationFormComponent } from '../client-application-form/client-application-form.component';
import { ClientApplicationService } from '../client-applications.service';
import { ClientApplicationsStore } from '../client-applications.store';

@Component({
  selector: 'ddap-client-application-detail',
  templateUrl: './client-application-detail.component.html',
  styleUrls: ['./client-application-detail.component.scss'],
  providers: [FormValidationService],
})
export class ClientApplicationDetailComponent
  extends IcConfigEntityDetailComponentBaseDirective<ClientApplicationsStore>
  implements OnInit {

  @ViewChild(ClientApplicationFormComponent)
  clientForm: ClientApplicationFormComponent;
  rotateSecret = false;

  constructor(
    protected route: ActivatedRoute,
    protected router: Router,
    protected validationService: FormValidationService,
    protected icConfigStore: IcConfigStore,
    protected clientsStore: ClientApplicationsStore,
    protected dialog: MatDialog,
    private clientService: ClientApplicationService
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
