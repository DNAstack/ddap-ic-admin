import { Injectable } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from "@angular/forms";
import { EntityModel, FormValidators, nameConstraintPattern } from "ddap-common-lib";
import _get from 'lodash.get';

@Injectable({
  providedIn: 'root',
})
export class ClientFormBuilder {

  constructor(private formBuilder: FormBuilder) {
  }

  buildForm(client?: EntityModel): FormGroup {
    return this.formBuilder.group({
      id: [_get(client, 'name'), [Validators.pattern(nameConstraintPattern)]],
      ui: this.formBuilder.group({
        label: [_get(client, 'dto.ui.label'), [Validators.required]],
        description: [_get(client, 'dto.ui.description'), [Validators.required, Validators.maxLength(255)]],
      }),
      clientId: [_get(client, 'dto.clientId'), []],
      scope: [_get(client, 'dto.scope'), [Validators.required]],
      grantTypes: this.buildArrayForm(_get(client, 'dto.grantTypes'), []),
      responseTypes: this.buildArrayForm(_get(client, 'dto.responseTypes'), []),
      redirectUris: this.buildArrayForm(_get(client, 'dto.redirectUris'), [FormValidators.url]),
    });
  }

  buildArrayForm(array?: string[], validators?: any[]): FormArray {
    return this.formBuilder.array(array
                                  ? array.map((value) => this.buildStringControl(value, validators))
                                  : []);
  }

  buildStringControl(value?: string, validators?: any[]): FormControl {
    return this.formBuilder.control(value, [...validators]);
  }

}


