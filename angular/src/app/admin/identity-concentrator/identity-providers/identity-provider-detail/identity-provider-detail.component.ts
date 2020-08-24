import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { FormValidationService } from 'ddap-common-lib';
import { ConfigModificationModel, EntityModel } from 'ddap-common-lib';

import { IcConfigEntityDetailComponentBaseDirective } from '../../shared/ic/ic-config-entity-detail-component-base.directive';
import { IcConfigStore } from '../../shared/ic/ic-config.store';
import { IdentityProviderFormComponent } from '../identity-provider-form/identity-provider-form.component';
import { IdentityProviderService } from '../identity-providers.service';
import { IdentityProvidersStore } from '../identity-providers.store';

@Component({
  selector: 'ddap-identity-provider-detail',
  templateUrl: './identity-provider-detail.component.html',
  styleUrls: ['./identity-provider-detail.component.scss'],
  providers: [FormValidationService],
})
export class IdentityProviderDetailComponent extends IcConfigEntityDetailComponentBaseDirective<IdentityProvidersStore> implements OnInit {

  @ViewChild('ddapForm')
  identityProviderForm: IdentityProviderFormComponent;

  constructor(
    protected route: ActivatedRoute,
    protected router: Router,
    protected validationService: FormValidationService,
    protected icConfigStore: IcConfigStore,
    protected identityProvidersStore: IdentityProvidersStore,
    protected dialog: MatDialog,
    private identityProviderService: IdentityProviderService
  ) {
    super(route, router, validationService, icConfigStore, identityProvidersStore, dialog);
  }

  update() {
    this.identityProviderForm.validateClientCredentials();
    if (!this.validate(this.identityProviderForm)) {
      return;
    }

    const identityProvider: EntityModel = this.identityProviderForm.getModel();
    const clientSecret = this.identityProviderForm.form.get('clientSecret').value;
    const change = new ConfigModificationModel(identityProvider.dto, {}, clientSecret);
    this.identityProviderService.update(this.entity.name, change)
      .subscribe(() => this.navigateUp('..'), this.showError);
  }

  protected delete() {
    this.identityProviderService.remove(this.entity.name)
      .subscribe(() => this.navigateUp('..'), this.showError);
  }

}
