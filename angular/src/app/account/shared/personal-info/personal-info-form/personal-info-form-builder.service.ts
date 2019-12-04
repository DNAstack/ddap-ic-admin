import { Injectable } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from "@angular/forms";
import _get from 'lodash.get';

@Injectable({
  providedIn: 'root',
})
export class PersonalInfoFormBuilder {

  constructor(private formBuilder: FormBuilder) {
  }

  buildForm(personalInfo?: any): FormGroup {
    return this.formBuilder.group({
      name: this.formBuilder.group({
        formatted: [_get(personalInfo, 'name.formatted')],
        familyName: [_get(personalInfo, 'name.familyName')],
        givenName: [_get(personalInfo, 'name.givenName')],
        middleName: [_get(personalInfo, 'name.middleName')],
      }),
      active: new FormControl({ value: _get(personalInfo, 'active'), disabled: true }),
      emails: this.buildEmailsForm(_get(personalInfo, 'emails')),
    });
  }

  buildEmailsForm(emails?: any[]): FormArray {
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


