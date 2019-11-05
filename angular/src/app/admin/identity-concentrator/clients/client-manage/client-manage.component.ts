import { Component, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormValidationService } from 'ddap-common-lib';
import { ConfigModificationModel, EntityModel } from 'ddap-common-lib';

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

  @ViewChild(ClientFormComponent, { static: false })
  clientForm: ClientFormComponent;

  constructor(protected route: ActivatedRoute,
              protected router: Router,
              protected validationService: FormValidationService,
              private clientService: ClientService) {
    super(route, router, validationService);
  }

  save() {
    if (!this.validate(this.clientForm)) {
      return;
    }

    const client: EntityModel = this.clientForm.getModel();
    const change = new ConfigModificationModel(client.dto, {});
    this.clientService.save(client.name, change)
      .subscribe(() => this.navigateUp('../..'), this.showError);
  }

}
