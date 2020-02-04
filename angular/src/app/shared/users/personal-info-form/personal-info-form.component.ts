import { Component, Input, OnInit } from '@angular/core';
import { FormArray, FormGroup } from '@angular/forms';
import { flatDeep, Form } from 'ddap-common-lib';
import _get from 'lodash.get';
import _isEqual from 'lodash.isequal';

import { scim } from '../../proto/user-service';
import { PathOperation } from '../path-operation.enum';

import { PersonalInfoFormBuilder } from './personal-info-form-builder.service';
import IPatch = scim.v2.IPatch;
import Patch = scim.v2.Patch;
import IOperation = scim.v2.Patch.IOperation;
import Operation = scim.v2.Patch.Operation;

@Component({
  selector: 'ddap-personal-info-form',
  templateUrl: './personal-info-form.component.html',
  styleUrls: ['./personal-info-form.component.scss'],
})
export class PersonalInfoFormComponent implements Form, OnInit {

  get emails() {
    return this.form.get('emails') as FormArray;
  }

  @Input()
  user?: any;
  @Input()
  adminMode: boolean;

  form: FormGroup;

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

  getModel(): IPatch {
    const formValues = this.form.getRawValue();
    const pathsToFields = this.getListOfFullPathsToFields('', {
      active: formValues.active,
      displayName: formValues.displayName,
      name: formValues.name,
    });
    const operations: IOperation[] = pathsToFields
      .filter((path) => this.valueHasChanged(path, _get(formValues, path)))
      .map((path) => {
        const newValue = _get(formValues, path);
        if (!newValue || newValue === '') {
          return this.getPatchOperationModel(PathOperation.remove, path, '');
        }
        return this.getPatchOperationModel(PathOperation.replace, path, newValue);
      });

    return Patch.create({
      schemas: ['urn:ietf:params:scim:api:messages:2.0:PatchOp'],
      operations,
    });
  }

  private valueHasChanged(pathToValue, newValue) {
    const previousValue = _get(this.user, pathToValue);
    if (!previousValue && !newValue) {
      return false;
    }
    return !_isEqual(previousValue, newValue);
  }

  private getPatchOperationModel(operation: PathOperation, path: string, value: string): IOperation {
    return Operation.create({
      op: operation,
      path,
      value: `${value}`,
    });
  }

  private getListOfFullPathsToFields(rootPath: string, obj: any): string[] {
    const concatPaths = (parentPath: string, key: string): string => {
      return parentPath !== '' ? `${parentPath}.${key}` : `${key}`;
    };

    const paths = [];
    Object.entries(obj).forEach(([key, value]) => {
      const path = concatPaths(rootPath, key);
      if (value instanceof Object) {
        paths.push(this.getListOfFullPathsToFields(path, value));
      } else {
        paths.push(path);
      }
    });
    return flatDeep(paths);
  }

}
