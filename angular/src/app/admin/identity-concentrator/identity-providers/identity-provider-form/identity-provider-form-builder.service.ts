import { Injectable } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { EntityModel, FormValidators, nameConstraintPattern } from 'ddap-common-lib';
import _get from 'lodash.get';

@Injectable({
  providedIn: 'root',
})
export class IdentityProviderFormBuilder {

  constructor(private formBuilder: FormBuilder) {
  }

  buildForm(identityProvider?: EntityModel): FormGroup {
    return this.formBuilder.group({
      id: [_get(identityProvider, 'name'), [Validators.pattern(nameConstraintPattern)]],
      ui: this.formBuilder.group({
        label: [_get(identityProvider, 'dto.ui.label'), [Validators.required]],
        description: [_get(identityProvider, 'dto.ui.description'), [Validators.required, Validators.maxLength(255)]],
      }),
      issuer: [_get(identityProvider, 'dto.issuer'), [Validators.required]],
      tokenUrl: [_get(identityProvider, 'dto.tokenUrl'), [FormValidators.url]],
      authorizeUrl: [_get(identityProvider, 'dto.authorizeUrl'), [FormValidators.url]],
      clientId: [_get(identityProvider, 'dto.clientId'), []],
      clientSecret: [],
      responseType: [_get(identityProvider, 'dto.responseType'), []],
      translateUsing: [_get(identityProvider, 'dto.translateUsing'), []],
      scopes: this.buildArrayForm(_get(identityProvider, 'dto.scopes')),
    });
  }

  buildArrayForm(array?: string[]): FormArray {
    return this.formBuilder.array(array
                                  ? array.map((value) => this.buildStringControl(value))
                                  : []);
  }

  buildStringControl(value?: string): FormControl {
    return this.formBuilder.control(value, [Validators.required]);
  }

}


