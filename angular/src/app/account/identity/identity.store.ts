import { Injectable } from '@angular/core';
import { Store } from 'ddap-common-lib';
import { Observable } from 'rxjs';
import { map, pluck } from 'rxjs/operators';

import { common } from '../../shared/proto/ic-service';

import { Identity, SimpleAccountInfo, UserInfo } from './identity.model';
import { IdentityService } from './identity.service';
import Account = common.Account;

@Injectable({
  providedIn: 'root',
})
export class IdentityStore extends Store<Identity> {

  constructor(private identityService: IdentityService) {
    super(null);
    this.init();
  }

  getLoginHintForPrimaryAccount(): Observable<string> {
    return this.state$
      .pipe(
        map((identity) => identity.account),
        map((account: UserInfo) => {
          if (account.connectedAccounts) {
            const primaryAccount: SimpleAccountInfo = account.connectedAccounts.find((connectedAccount: SimpleAccountInfo) => {
              return connectedAccount.primary;
            });
            // If no account is marked primary select first one
            return primaryAccount ? primaryAccount.loginHint : account.connectedAccounts[0].loginHint;
          } else {
            // If there is no connected account we can't select loginHint
            return '';
          }
        })
      );
  }

  private init(): void {
    this.identityService.getIdentity()
      .subscribe((identity: Identity) => {
        this.setState(identity);
      });
  }

}
