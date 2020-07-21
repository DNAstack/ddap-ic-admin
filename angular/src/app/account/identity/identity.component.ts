import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute } from '@angular/router';
import _get from 'lodash.get';
import { Observable } from 'rxjs';
import { flatMap } from 'rxjs/operators';

import { scim } from '../../shared/proto/ic-service';
import { PersonalInfoFormComponent } from '../../shared/users/personal-info-form/personal-info-form.component';
import {
  UserAccountCloseConfirmationDialogComponent
} from '../../shared/users/user-account-close-confirmation-dialog/user-account-close-confirmation-dialog.component';
import { UserService } from '../../shared/users/user.service';

import { IdentityService } from './identity.service';
import { IdentityStore } from './identity.store';
import IUser = scim.v2.IUser;

@Component({
  templateUrl: './identity.component.html',
  styleUrls: ['./identity.component.scss'],
})
export class IdentityComponent implements OnInit {

  @ViewChild(PersonalInfoFormComponent)
  personalInfoForm: PersonalInfoFormComponent;

  realm: string;
  userInfo$: Observable<IUser>;

  constructor(private activatedRoute: ActivatedRoute,
              private identityService: IdentityService,
              private identityStore: IdentityStore,
              private userService: UserService,
              private dialog: MatDialog,
              private snackBar: MatSnackBar) {

  }

  ngOnInit(): void {
    this.activatedRoute.root.firstChild.params.subscribe((params) => {
      this.realm = params.realmId;
    });

    this.userInfo$ = this.userService.getLoggedInUser();
  }

  updatePersonalInfo(): void {
    const change = this.personalInfoForm.getModel();
    this.userService.patchLoggedInUser(change)
      .subscribe(
        () => this.openSnackBar('Successfully update personal information. To take effect reload the page.'),
        ({ error }) => {
          const defaultErrorMessage = 'Failed to update personal information. Please try again.';
          this.openSnackBar(this.extractHumanReadableErrorMessage(error, defaultErrorMessage));
        }
      );
  }

  closeAccount(user: IUser) {
    const dialogRef = this.dialog.open(UserAccountCloseConfirmationDialogComponent, {
      data: {
        selfClosing: true,
      },
    });
    dialogRef.afterClosed().subscribe((acknowledged) => {
      if (acknowledged) {
        this.userService.deleteUser(user.id)
            .pipe(
                flatMap(() => this.identityService.invalidateTokens())
            )
            .subscribe(() => window.location.href = `/`);
      }
    });
  }

  private openSnackBar(message) {
    this.snackBar.open(message, null, {
      duration: 3000,
    });
  }

  private extractHumanReadableErrorMessage(error: object, defaultMessage?: string) {
    const errorMessage: string = _get(error, 'message', defaultMessage);
    return errorMessage.startsWith('operation 0:')
      ? errorMessage.replace('operation 0:', '')
      : errorMessage;
  }

}
