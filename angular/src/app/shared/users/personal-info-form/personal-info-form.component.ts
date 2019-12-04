import { Component, Input, OnInit } from "@angular/core";
import { FormArray, FormGroup } from "@angular/forms";
import { PersonalInfoFormBuilder } from "./personal-info-form-builder.service";
import _get from 'lodash.get';
import IPatch = scim.v2.IPatch;
import { Form } from "ddap-common-lib";
import { scim } from "../../proto/user-service";
import Patch = scim.v2.Patch;
import { flatDeep } from "../../util";
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
      name: formValues.name
    });
    const operations: IOperation[] = pathsToFields
      .filter((path) => _get(formValues, path))
      .map((path) => {
        return this.getPatchOperationModel(path, _get(formValues, path));
      });

    return Patch.create({
      schemas: ["urn:ietf:params:scim:api:messages:2.0:PatchOp"],
      operations,
    });
  }

  private getPatchOperationModel(path: string, value: string): IOperation {
    return Operation.create({
      op: "replace",
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
