import { Component, Input, OnInit } from '@angular/core';
import Client = common.Client;
import { FormArray, FormGroup, Validators } from '@angular/forms';
import { EntityModel, Form, FormValidators, isExpanded } from 'ddap-common-lib';

import { common } from '../../../../shared/proto/ic-service';

import { ClientFormBuilder } from './client-form-builder.service';

@Component({
  selector: 'ddap-client-form',
  templateUrl: './client-form.component.html',
  styleUrls: ['./client-form.component.scss'],
})
export class ClientFormComponent implements Form, OnInit {

  get redirectUris() {
    return this.form.get('redirectUris') as FormArray;
  }

  get grantTypes() {
    return this.form.get('grantTypes') as FormArray;
  }

  get responseTypes() {
    return this.form.get('responseTypes') as FormArray;
  }

  @Input()
  client?: EntityModel = new EntityModel('', Client.create());

  form: FormGroup;
  isExpanded: Function = isExpanded;

  constructor(private clientFormBuilder: ClientFormBuilder) {
  }

  ngOnInit(): void {
    this.form = this.clientFormBuilder.buildForm(this.client);
  }

  addRedirectUri(): void {
    if (!this.redirectUris.at(0).value) {
      // Skip if recently added was not touched
      return;
    }
    this.redirectUris.insert(0, this.clientFormBuilder.buildStringControl(null, [Validators.required, FormValidators.url]));
  }

  addGrantType(): void {
    if (!this.grantTypes.at(0).value) {
      // Skip if recently added was not touched
      return;
    }
    this.grantTypes.insert(0, this.clientFormBuilder.buildStringControl(null, [Validators.required]));
  }

  addResponseType(): void {
    if (!this.grantTypes.at(0).value) {
      // Skip if recently added was not touched
      return;
    }
    this.responseTypes.insert(0, this.clientFormBuilder.buildStringControl(null, [Validators.required]));
  }

  getModel(): EntityModel {
    const { id, ...rest } = this.form.value;
    const clientApplication: Client = Client.create({
      ...rest,
    });

    return new EntityModel(id, clientApplication);
  }

  getAllForms(): FormGroup[] {
    return [this.form];
  }

  isValid(): boolean {
    return this.form.valid;
  }

}
