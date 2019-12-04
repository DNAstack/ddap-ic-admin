import { Component, Input, OnInit } from "@angular/core";
import { FormArray, FormGroup } from "@angular/forms";
import { PersonalInfoFormBuilder } from "./personal-info-form-builder.service";
import IPatch = scim.v2.IPatch;
import { Form } from "ddap-common-lib";
import { scim } from "../../proto/user-service";

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

  getModel(): IPatch {
    const { name } = this.form.value;
    // TODO: map to patch model
    return null;
  }

  getAllForms(): FormGroup[] {
    return [this.form];
  }

  isValid(): boolean {
    return this.form.valid;
  }

}
