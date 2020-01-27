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
      clientId: [_get(client, 'dto.clientId'), [Validators.required]],
      redirectUris: this.buildArrayForm(_get(client, 'dto.redirectUris')),
    });
  }

  buildArrayForm(array?: string[]): FormArray {
    return this.formBuilder.array(array
                                  ? array.map((value) => this.buildStringControl(value))
                                  : []);
  }

  buildStringControl(value?: string): FormControl {
    return this.formBuilder.control(value, [Validators.required, FormValidators.url]);
  }

}


