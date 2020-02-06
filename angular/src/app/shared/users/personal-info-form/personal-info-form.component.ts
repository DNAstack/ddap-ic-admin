import { Component, Input, OnInit } from '@angular/core';
import { AbstractControl, FormArray, FormGroup, Validators } from '@angular/forms';
import { Form, FormValidators, isExpanded } from 'ddap-common-lib';

import { scim } from '../../proto/user-service';

import { PersonalInfoFormBuilder } from './personal-info-form-builder.service';
import IPatch = scim.v2.IPatch;
import Patch = scim.v2.Patch;
import IOperation = scim.v2.Patch.IOperation;

import { ScimService } from "../scim.service";

@Component({
  selector: 'ddap-personal-info-form',
  templateUrl: './personal-info-form.component.html',
  styleUrls: ['./personal-info-form.component.scss'],
})
export class PersonalInfoFormComponent implements Form, OnInit {

  get emails() {
    return this.form.get('emails') as FormArray;
  }

  get photos() {
    return this.form.get('photos') as FormArray;
  }

  @Input()
  user?: any;
  @Input()
  adminMode: boolean;

  form: FormGroup;
  isExpanded: Function = isExpanded;

  constructor(private personalInfoFormBuilder: PersonalInfoFormBuilder) {
  }

  ngOnInit() {
    this.form = this.personalInfoFormBuilder.buildForm(this.adminMode, this.user);
  }

  getAllForms(): FormGroup[] {
    return [this.form];
  }

  isValid(): boolean {
    return this.form.valid;
  }

  unlinkAccount(i) {
    // TODO
  }

  makeAttributePrimary(controls: AbstractControl[], controlToBePrimary: AbstractControl): void {
    const unsetAllAttributesAsPrimary = () => {
      controls.forEach((control) => {
        control.get('primary').setValue(false);
      });
    };

    unsetAllAttributesAsPrimary();
    controlToBePrimary.get('primary').setValue(true);
  }

  getModel(): IPatch {
    const operations: IOperation[] = ScimService.getOperationsForNonArrayFields(this.user, this.form.getRawValue());

    return Patch.create({
      schemas: ['urn:ietf:params:scim:api:messages:2.0:PatchOp'],
      operations,
    });
  }

}
