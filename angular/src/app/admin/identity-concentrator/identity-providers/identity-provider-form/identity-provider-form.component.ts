import { Component, Input, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { FormValidators, isExpanded } from 'ddap-common-lib';
import { Form } from 'ddap-common-lib';
import { EntityModel, nameConstraintPattern } from 'ddap-common-lib';
import _get from 'lodash.get';
import { Observable } from 'rxjs';

import { ic } from '../../../../shared/proto/ic-service';

import IdentityProvider = ic.v1.IdentityProvider;
import { IdentityProviderFormBuilder } from "./identity-provider-form-builder.service";

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
    this.scopes.insert(0, this.identityProviderFormBuilder.buildStringControl());
  }

  removeScope(index: number): void {
    this.scopes.removeAt(index);
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
