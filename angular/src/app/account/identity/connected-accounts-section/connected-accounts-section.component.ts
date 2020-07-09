import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import _get from 'lodash.get';
import { Observable, Subscription } from 'rxjs';
import { share } from 'rxjs/operators';

import { scim } from '../../../shared/proto/ic-service';
import { ScimService } from '../../../shared/users/scim.service';
import { UserService } from '../../../shared/users/user.service';
import { AccountLink } from '../account-link.model';
import { SimpleAccountInfo, UserInfo } from '../identity.model';
import { IdentityService } from '../identity.service';
import { IdentityStore } from '../identity.store';
import { identityProviderMetadataExists, identityProviders } from '../providers.constants';
import IUser = scim.v2.IUser;
import { VisaPassportService } from '../visa-passports/visa-passport.service';

@Component({
  selector: 'ddap-connected-accounts-section',
  templateUrl: './connected-accounts-section.component.html',
  styleUrls: ['./connected-accounts-section.component.scss'],
})
export class ConnectedAccountsSectionComponent implements OnInit, OnDestroy {

  @Input()
  realm: string;
  @Input()
  userInfo: IUser;

  displayScopeWarning: boolean;
  identityStoreSubscription: Subscription;
  availableAccounts$: Observable<AccountLink[]>;
  icAccount: UserInfo;

  constructor(private identityService: IdentityService,
              private identityStore: IdentityStore,
              private visaPassportService: VisaPassportService,
              private userService: UserService) {
  }

  ngOnInit(): void {
    this.identityStoreSubscription = this.identityStore.state$
      .subscribe((identity) => {
        if (!identity) {
          return;
        }
        this.icAccount = identity.account;
        this.displayScopeWarning = !identity.scopes.includes('link');
        if (!this.displayScopeWarning) {
          this.availableAccounts$ = this.identityService.getAccountLinks()
            .pipe(share());
        }
      });
  }


  ngOnDestroy(): void {
    this.identityStoreSubscription.unsubscribe();
  }

  hasExpiringClaims(account: SimpleAccountInfo): boolean {
    if (!account || !account.passport) {
      return false;
    }

    return Object.entries(account.passport).some(([_, passport]: any) => {
      return this.visaPassportService.isExpiring(passport);
    });
  }

  refreshClaims(account: any): void {
    window.location.href = `${this.getLoginUrl()}&loginHint=${account.loginHint}`;
  }

  getConnectAccountPicture(account: SimpleAccountInfo) {
    const provider = account.provider;
    return _get(account, 'profile.picture', this.getDefaultProviderPicture(provider));
  }

  getProvider(account: SimpleAccountInfo) {
    return account.provider;
  }

  redirectToLoginWithLinkScopeAndLoginHint(): void {
    this.identityStore.getLoginHintForPrimaryAccount()
      .subscribe((loginHint) => {
        window.location.href = `${this.getLoginUrl()}&loginHint=${loginHint}`;
      });
  }

  redirectToLoginWithLinkScope(providerLink: string): void {
    window.location.href = `${providerLink}`;
  }

  unlinkAccount(account) {
    const emailObj = this.userInfo.emails.find((email) => email.value === account.properties.email);
    this.userService.patchUser(this.userInfo.id, ScimService.getAccountUnlinkPatch(emailObj['$ref']))
      .subscribe(() => window.location.reload());
  }

  getProviderPicture(provider: string) {
    return this.getDefaultProviderPicture(provider);
  }

  private getLoginUrl(): string {
    const loginUrlSuffix = `login?scope=link+openid+account_admin+ga4gh_passport_v1+identities&redirectUri=/${this.realm}/account/identity`;
    return `/api/v1alpha/realm/${this.realm}/identity/${loginUrlSuffix}`;
  }

  private getDefaultProviderPicture(provider: string) {
    return identityProviderMetadataExists(provider)
           ? identityProviders[provider].imagePath
           : identityProviders.defaultImagePath;
  }
}
