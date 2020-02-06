import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import IUser = scim.v2.IUser;
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute } from '@angular/router';
import { VisaPassportService } from 'ddap-common-lib';
import _get from 'lodash.get';
import { Observable, Subscription } from 'rxjs';
import { flatMap } from 'rxjs/operators';

import { common } from '../../shared/proto/ic-service';
import { scim } from '../../shared/proto/user-service';
import IConnectedAccount = common.IConnectedAccount;
import { PersonalInfoFormComponent } from '../../shared/users/personal-info-form/personal-info-form.component';
import {
  UserAccountCloseConfirmationDialogComponent
} from '../../shared/users/user-account-close-confirmation-dialog/user-account-close-confirmation-dialog.component';
import { UserService } from '../../shared/users/user.service';

import { AccountLink } from './account-link.model';
import { Identity } from './identity.model';
import { IdentityService } from './identity.service';
import { IdentityStore } from './identity.store';
import { identityProviderMetadataExists, identityProviders } from './providers.constants';

@Component({
  templateUrl: './identity.component.html',
  styleUrls: ['./identity.component.scss'],
})
export class IdentityComponent implements OnInit {

  @ViewChild(PersonalInfoFormComponent, { static: false })
  personalInfoForm: PersonalInfoFormComponent;

  identity: Identity;
  availableAccounts: AccountLink[];
  availableAccountsSubscription: Subscription;

  realm: string;
  displayScopeWarning = false;
  userInfo$: Observable<IUser>;

  constructor(private activatedRoute: ActivatedRoute,
              private identityService: IdentityService,
              private identityStore: IdentityStore,
              private visaPassportService: VisaPassportService,
              private userService: UserService,
              private dialog: MatDialog,
              private snackBar: MatSnackBar) {

  }

  ngOnInit(): void {
    this.activatedRoute.root.firstChild.params.subscribe((params) => {
      this.realm = params.realmId;
    });

    this.userInfo$ = this.userService.getLoggedInUser();

    this.identityStore.state$
      .subscribe((identity: Identity) => {
        this.identity = identity;
        if (this.hasLinkScope()) {
          this.getAvailableAccounts();
        } else {
          this.displayScopeWarning = true;
        }
      });
    // FIXME: This is workaround to refresh cookies after externalIdp linking
    this.identityService.refreshTokens()
      .subscribe();
  }

  hasExpiringClaims(account: IConnectedAccount): boolean {
    if (!account || !account.passport) {
      return false;
    }

    return Object.entries(account.passport).some(([_, passport]: any) => {
      return passport.some((value) => this.visaPassportService.isExpiring(value));
    });
  }

  getProvider(account: IConnectedAccount) {
    return _get(account, 'identityProvider.ui.label', account.provider);
  }

  getPicture(account: IConnectedAccount) {
    const username = _get(account, 'profile.username', account.provider);
    return _get(account, 'profile.picture', this.getDefaultProviderPicture(username));
  }

  hasLinkScope(): boolean {
    if (!this.identity) {
      return false;
    }
    const { scopes = [] }  = this.identity;
    return scopes.includes('link');
  }

  unlinkConnectedAccount(account: IConnectedAccount): void {
    this.identityService.unlinkConnectedAccount(account);
  }

  redirectToLoginWithLinkScope(): void {
    this.identityStore.getLoginHintForPrimaryAccount()
      .subscribe((loginHint) => {
        window.location.href = `${this.getLoginUrl()}&loginHint=${loginHint}`;
      });
  }

  refreshClaims(account: any): void {
    window.location.href = `${this.getLoginUrl()}&loginHint=${account.loginHint}`;
  }

  updatePersonalInfo(): void {
    const change = this.personalInfoForm.getModel();
    this.userService.patchLoggedInUser(change)
      .subscribe(() => this.openSnackBar('Successfully update personal information. To take effect reload the page.'));
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

  private getLoginUrl(): string {
    const loginUrlSuffix = `login?scope=link+openid+account_admin+ga4gh_passport_v1+identities&redirectUri=/${this.realm}/account/identity`;
    return `/api/v1alpha/realm/${this.realm}/identity/${loginUrlSuffix}`;
  }

  private getAvailableAccounts() {
    this.identityService.getAccountLinks()
      .subscribe((availableAccounts: AccountLink[]) => {
        this.availableAccounts = availableAccounts;
      });
  }

  private getDefaultProviderPicture(provider: string) {
    return identityProviderMetadataExists(provider)
      ? identityProviders[provider].imagePath
      : identityProviders.defaultImagePath;
  }
}
