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
    this.redirectUris.insert(0, this.clientFormBuilder.buildStringControl(null, [Validators.required, FormValidators.url]));
  }

  removeRedirectUri(index: number): void {
    this.redirectUris.removeAt(index);
  }

  addGrantType(): void {
    this.grantTypes.insert(0, this.clientFormBuilder.buildStringControl(null, [Validators.required]));
  }

  removeGrantType(index: number): void {
    this.grantTypes.removeAt(index);
  }

  addResponseType(): void {
    this.responseTypes.insert(0, this.clientFormBuilder.buildStringControl(null, [Validators.required]));
  }

  removeResponseType(index: number): void {
    this.responseTypes.removeAt(index);
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
