import { Component, Input, OnInit } from '@angular/core';
import { FormArray, FormGroup } from '@angular/forms';
import { isExpanded } from 'ddap-common-lib';
import Client = ic.v1.Client;
import { Form } from 'ddap-common-lib';
import { EntityModel } from 'ddap-common-lib';

import { ic } from '../../../../shared/proto/ic-service';

import { ClientFormBuilder } from './client-form-builder.service';

@Component({
  selector: 'ddap-client-form',
  templateUrl: './client-form.component.html',
  styleUrls: ['./client-form.component.scss'],
})
export class ClientFormComponent implements Form, OnInit {

  @Input()
  client?: EntityModel = new EntityModel('', Client.create());

  form: FormGroup;
  isExpanded: Function = isExpanded;

  get redirectUris() {
    return this.form.get('redirectUris') as FormArray;
  }

  constructor(private clientFormBuilder: ClientFormBuilder) {
  }

  ngOnInit(): void {
    this.form = this.clientFormBuilder.buildForm(this.client);
  }

  addRedirectUri() {
    this.redirectUris.insert(0, this.clientFormBuilder.buildStringControl());
  }

  removeRedirectUri(index: number): void {
    this.redirectUris.removeAt(index);
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
