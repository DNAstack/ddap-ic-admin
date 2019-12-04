import { Component, OnInit, ViewChild } from "@angular/core";
import { ActivatedRoute } from '@angular/router';
import _get from 'lodash.get';
import { Subscription } from 'rxjs';

import { AccountLink } from './account-link.model';
import { Identity } from './identity.model';
import { IdentityService } from './identity.service';
import { IdentityStore } from './identity.store';
import { identityProviderMetadataExists, identityProviders } from './providers.constants';
import { VisaPassportService } from "ddap-common-lib";
import { ic } from "../../shared/proto/ic-service";
import IConnectedAccount = ic.v1.IConnectedAccount;
import { PersonalInfoService } from "../shared/personal-info/personal-info.service";
import { PersonalInfoFormComponent } from "../shared/personal-info/personal-info-form/personal-info-form.component";

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
  userInfo: any;

  constructor(private activatedRoute: ActivatedRoute,
              private identityService: IdentityService,
              private identityStore: IdentityStore,
              private visaPassportService: VisaPassportService,
              private personalInfoService: PersonalInfoService) {

  }

  ngOnInit(): void {
    this.activatedRoute.root.firstChild.params.subscribe((params) => {
      this.realm = params.realmId;
    });

    this.personalInfoService.getLoggedInUserInformation()
      .subscribe((userInfo) => {
        console.log(userInfo);
        this.userInfo = userInfo;
      });

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
    const userInfo = this.personalInfoForm.getModel();
    this.personalInfoService.patchLoggedInUserInformation(userInfo);
  }

  private getLoginUrl(): string {
    const loginUrlSuffix = `login?scope=link+openid+account_admin+ga4gh_passport_v1+identities&redirectUri=/${this.realm}/account/identity`;
    return `/api/v1alpha/${this.realm}/identity/${loginUrlSuffix}`;
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
