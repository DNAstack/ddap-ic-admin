import { Injectable } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from "@angular/forms";
import _get from 'lodash.get';
import { scim } from "../../proto/user-service";
import IUser = scim.v2.IUser;
import IAttribute = scim.v2.IAttribute;

@Injectable({
  providedIn: 'root',
})
export class PersonalInfoFormBuilder {

  constructor(private formBuilder: FormBuilder) {
  }

  buildForm(user?: IUser): FormGroup {
    return this.formBuilder.group({
      name: this.formBuilder.group({
        formatted: [_get(user, 'name.formatted')],
        familyName: [_get(user, 'name.familyName')],
        givenName: [_get(user, 'name.givenName')],
        middleName: [_get(user, 'name.middleName')],
      }),
      active: new FormControl({ value: _get(user, 'active'), disabled: true }),
      emails: this.buildEmailsForm(_get(user, 'emails')),
    });
  }

  buildEmailsForm(emails?: IAttribute[]): FormArray {
    return this.formBuilder.array(emails
                                  ? emails.map(({ value }: any) => this.buildEmailForm(value))
                                  : []
    );
  }

  buildEmailForm(value?: string): FormGroup {
    return this.formBuilder.group({
      value: [value],
    });
  }

}


