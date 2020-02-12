import { Component, Input, OnDestroy, OnInit } from "@angular/core";
import IConnectedAccount = common.IConnectedAccount;
import { VisaPassportService } from 'ddap-common-lib';
import _get from 'lodash.get';
import { Observable, Subscription } from "rxjs";
import { share, tap } from "rxjs/operators";

import { common } from '../../../shared/proto/ic-service';
import { AccountLink } from '../account-link.model';
import { Identity } from '../identity.model';
import { IdentityService } from '../identity.service';
import { IdentityStore } from '../identity.store';
import { identityProviderMetadataExists, identityProviders } from '../providers.constants';

@Component({
  selector: 'ddap-connected-accounts-section',
  templateUrl: './connected-accounts-section.component.html',
  styleUrls: ['./connected-accounts-section.component.scss'],
})
export class ConnectedAccountsSectionComponent implements OnInit, OnDestroy {

  @Input()
  realm: string;

  displayScopeWarning: boolean;
  identityStoreSubscription: Subscription;
  availableAccounts$: Observable<AccountLink[]>;
  connectedAccounts: IConnectedAccount[];

  constructor(private identityService: IdentityService,
              private identityStore: IdentityStore,
              private visaPassportService: VisaPassportService) {
  }

  ngOnInit(): void {
    this.identityStoreSubscription = this.identityStore.state$
      .subscribe((identity) => {
        if (!identity) {
          return;
        }
        this.connectedAccounts = identity.account.connectedAccounts;
        this.availableAccounts$ = this.identityService.getAccountLinks()
          .pipe(share());
      });
  }


  ngOnDestroy(): void {
    this.identityStoreSubscription.unsubscribe();
  }

  hasExpiringClaims(account: IConnectedAccount): boolean {
    if (!account || !account.passport) {
      return false;
    }

    return Object.entries(account.passport).some(([_, passport]: any) => {
      return passport.some((value) => this.visaPassportService.isExpiring(value));
    });
  }

  refreshClaims(account: any): void {
    window.location.href = `${this.getLoginUrl()}&loginHint=${account.loginHint}`;
  }

  getPicture(account: IConnectedAccount) {
    const username = _get(account, 'profile.username', account.provider);
    return _get(account, 'profile.picture', this.getDefaultProviderPicture(username));
  }

  getProvider(account: IConnectedAccount) {
    return _get(account, 'identityProvider.ui.label', account.provider);
  }

  unlinkConnectedAccount(account: IConnectedAccount): void {
    this.identityService.unlinkConnectedAccount(account);
  }

  redirectToLoginWithLinkScopeAndLoginHint(): void {
    this.identityStore.getLoginHintForPrimaryAccount()
      .subscribe((loginHint) => {
        window.location.href = `${this.getLoginUrl()}&loginHint=${loginHint}`;
      });
  }

  redirectToLoginWithLinkScope(): void {
    window.location.href = `${this.getLoginUrl()}`;
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
