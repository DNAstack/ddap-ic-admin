import { Component, OnDestroy, OnInit, ViewChild } from "@angular/core";
import { Observable, Subscription } from "rxjs";
import { UsersService } from "../../../shared/users/users.service";
import { scim } from "../../../shared/proto/user-service";
import IUser = scim.v2.IUser;
import { PersonalInfoFormComponent } from "../../../shared/users/personal-info-form/personal-info-form.component";
import { ActivatedRoute, Router } from "@angular/router";
import { FormValidationService } from "ddap-common-lib";
import { Form } from "ddap-common-lib";
import IPatch = scim.v2.IPatch;

@Component({
  selector: 'ddap-user-detail',
  templateUrl: './user-detail.component.html',
  styleUrls: ['./user-detail.component.scss'],
})
export class UserDetailComponent implements OnInit, OnDestroy {

  get entityId() {
    return this.route.snapshot.params.entityId;
  }

  @ViewChild(PersonalInfoFormComponent, { static: false })
  personalInfoForm: PersonalInfoFormComponent;

  entity: IUser;
  formErrorMessage: string;
  isFormValid: boolean;
  isFormValidated: boolean;

  private subscription: Subscription;

  constructor(private route: ActivatedRoute,
              private router: Router,
              private validationService: FormValidationService,
              private usersService: UsersService) {
  }

  ngOnInit() {
    this.subscription = this.usersService.getUser(this.entityId)
      .subscribe((entity) => {
        this.entity = entity;
      });
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  update() {
    if (!this.validate(this.personalInfoForm)) {
      return;
    }

    const change: IPatch = this.personalInfoForm.getModel();
    this.usersService.patchUser(this.entity.id, change)
      .subscribe(() => this.navigateUp('..'));
  }

  // handleError = ({ error }) => {
  //   this.displayFieldErrorMessage(error, DamConfigEntityType.policies, this.accessPolicyForm.form);
  // }

  private navigateUp = (path: string) => this.router.navigate([path], { relativeTo: this.route });

  private validate(form: Form): boolean {
    this.formErrorMessage = null;
    this.isFormValid = this.validationService.validate(form);
    this.isFormValidated = true;
    return this.isFormValid;
  }

}