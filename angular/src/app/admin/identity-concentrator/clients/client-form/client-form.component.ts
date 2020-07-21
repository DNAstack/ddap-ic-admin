import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import Client = common.Client;
import { AbstractControl, FormArray, FormGroup, Validators } from '@angular/forms';
import { EntityModel, Form, FormValidators } from 'ddap-common-lib';
import { Subscription } from 'rxjs';

import { common } from '../../../../shared/proto/ic-service';
import { generateInternalName } from '../../shared/internal-name.util';

import { ClientFormBuilder } from './client-form-builder.service';

@Component({
  selector: 'ddap-client-form',
  templateUrl: './client-form.component.html',
  styleUrls: ['./client-form.component.scss'],
})
export class ClientFormComponent implements Form, OnInit, OnDestroy {

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
  internalNameEditable = false;
  @Input()
  client?: EntityModel = new EntityModel('', Client.create());

  form: FormGroup;
  subscriptions: Subscription[] = [];

  constructor(private clientFormBuilder: ClientFormBuilder) {
  }

  ngOnInit(): void {
    this.form = this.clientFormBuilder.buildForm(this.client);
    if (this.internalNameEditable) {
      this.subscriptions.push(this.form.get('ui.label').valueChanges
        .subscribe((displayName) => {
          this.form.get('id').setValue(generateInternalName(displayName));
        }));
    }
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach((subscription) => subscription.unsubscribe());
  }

  addRedirectUri(): void {
    const firstControl = this.getFirstControl(this.redirectUris);
    if (firstControl && !firstControl.value) {
      // Skip if recently added was not touched
      return;
    }
    this.redirectUris.insert(0, this.clientFormBuilder.buildStringControl(null, [Validators.required, FormValidators.url]));
  }

  addGrantType(): void {
    const firstControl = this.getFirstControl(this.grantTypes);
    if (firstControl && !firstControl.value) {
      // Skip if recently added was not touched
      return;
    }
    this.grantTypes.insert(0, this.clientFormBuilder.buildStringControl(null, [Validators.required]));
  }

  addResponseType(): void {
    const firstControl = this.getFirstControl(this.responseTypes);
    if (firstControl && !firstControl.value) {
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

  private getFirstControl(formControls: FormArray): AbstractControl {
    return formControls.at(0);
  }

}
