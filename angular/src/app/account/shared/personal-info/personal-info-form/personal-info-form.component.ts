import { Component, Input, OnInit } from "@angular/core";
import { FormArray, FormGroup } from "@angular/forms";
import { PersonalInfoFormBuilder } from "./personal-info-form-builder.service";

@Component({
  selector: 'ddap-personal-info-form',
  templateUrl: './personal-info-form.component.html',
  styleUrls: ['./personal-info-form.component.scss'],
})
export class PersonalInfoFormComponent implements OnInit {

  get emails() {
    return this.form.get('emails') as FormArray;
  }

  @Input()
  user?: any;

  form: FormGroup;

  constructor(private personalInfoFormBuilder: PersonalInfoFormBuilder) {

  }

  ngOnInit() {
    this.form = this.personalInfoFormBuilder.buildForm(this.user);
  }

}
