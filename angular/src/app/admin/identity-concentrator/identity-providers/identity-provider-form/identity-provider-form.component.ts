import { Component, Input, OnInit } from '@angular/core';
import { FormArray, FormGroup } from '@angular/forms';
import { isExpanded } from 'ddap-common-lib';
import { Form } from 'ddap-common-lib';
import { EntityModel } from 'ddap-common-lib';
import { Observable } from 'rxjs';

import { common } from '../../../../shared/proto/ic-service';

import IdentityProvider = common.IdentityProvider;
import { IdentityProviderFormBuilder } from './identity-provider-form-builder.service';

@Component({
  selector: 'ddap-identity-provider-form',
  templateUrl: './identity-provider-form.component.html',
  styleUrls: ['./identity-provider-form.component.scss'],

})
export class IdentityProviderFormComponent implements OnInit, Form {

  get scopes() {
    return this.form.get('scopes') as FormArray;
  }

  @Input()
  identityProvider?: EntityModel = new EntityModel('', IdentityProvider.create());

  form: FormGroup;
  isExpanded: Function = isExpanded;
  translators$: Observable<any>;

  constructor(private identityProviderFormBuilder: IdentityProviderFormBuilder) {
  }

  ngOnInit(): void {
    this.form = this.identityProviderFormBuilder.buildForm(this.identityProvider);
  }

  addScope() {
    if (!this.scopes.at(0).value) {
      // Skip if recently added was not touched
      return;
    }
    this.scopes.insert(0, this.identityProviderFormBuilder.buildStringControl());
  }

  getModel(): EntityModel {
    const { id, ...rest } = this.form.value;

    const identityProvider: IdentityProvider = IdentityProvider.create({
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

}
