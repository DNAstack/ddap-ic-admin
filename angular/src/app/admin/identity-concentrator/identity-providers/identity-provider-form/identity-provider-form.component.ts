import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { AbstractControl, FormArray, FormGroup } from '@angular/forms';
import { Form } from 'ddap-common-lib';
import { EntityModel } from 'ddap-common-lib';
import { Observable, Subscription } from 'rxjs';

import { common } from '../../../../shared/proto/ic-service';
import { generateInternalName } from '../../shared/internal-name.util';

import { IdentityProviderFormBuilder } from './identity-provider-form-builder.service';

import IdentityProvider = common.IdentityProvider;

@Component({
  selector: 'ddap-identity-provider-form',
  templateUrl: './identity-provider-form.component.html',
  styleUrls: ['./identity-provider-form.component.scss'],

})
export class IdentityProviderFormComponent implements OnInit, OnDestroy, Form {

  get scopes() {
    return this.form.get('scopes') as FormArray;
  }

  @Input()
  internalNameEditable = false;
  @Input()
  identityProvider?: EntityModel = new EntityModel('', IdentityProvider.create());

  form: FormGroup;
  subscriptions: Subscription[] = [];
  translators$: Observable<any>;
  clientCredentialsSet = false;

  constructor(private identityProviderFormBuilder: IdentityProviderFormBuilder) {
  }

  ngOnInit(): void {
    this.form = this.identityProviderFormBuilder.buildForm(this.identityProvider);
    if (this.internalNameEditable) {
      this.subscriptions.push(this.form.get('ui.label').valueChanges
        .subscribe((displayName) => {
          this.form.get('id').setValue(generateInternalName(displayName));
        }));
    }
    this.clientCredentialsSet = !!this.identityProvider?.dto?.clientId;
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach((subscription) => subscription.unsubscribe());
  }

  getModel(): EntityModel {
    const { id, scopes, clientSecret, ...rest } = this.form.value;

    const identityProvider: IdentityProvider = IdentityProvider.create({
      scopes: this.removeEmptyValues(scopes),
      ...rest,
    });

    return new EntityModel(id, identityProvider);
  }

  getAllForms(): FormGroup[] {
    return [this.form];
  }

  isValid(): boolean {
    return this.form.valid;
  }

  removeEmptyValues(values: string[]) {
    return values.filter(value => value.length > 0);
  }

  validateClientCredentials(): void {
    const clientId: string = this.form.get('clientId').value;
    const clientSecret: string = this.form.get('clientSecret').value;

    const clientIdInputIsEmpty = !clientId || !clientId.trim();
    const clientSecretInputIsEmpty = !clientSecret || !clientSecret.trim();

    if (this.clientCredentialsSet && clientIdInputIsEmpty) {
      this.form.get('clientId').setErrors({ empty: true });
    }
    if (!this.clientCredentialsSet && !clientIdInputIsEmpty && clientSecretInputIsEmpty) {
      this.form.get('clientSecret').setErrors({ empty: true });
    }
    if (!this.clientCredentialsSet && clientIdInputIsEmpty) {
      this.form.get('clientSecret').reset();
    }
  }

  private getFirstControl(formControls: FormArray): AbstractControl {
    return formControls.at(0);
  }

}
