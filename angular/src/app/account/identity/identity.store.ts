import { Injectable } from '@angular/core';
import { Store } from 'ddap-common-lib';
import { Observable } from 'rxjs';
import { map, pluck } from 'rxjs/operators';

import { common } from '../../shared/proto/ic-service';

import { Identity } from './identity.model';
import { IdentityService } from './identity.service';
import Account = common.Account;
import ConnectedAccount = common.ConnectedAccount;

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
        pluck('account'),
        map((account: Account) => {
          const primaryAccount: any = account.connectedAccounts.find((connectedAccount: ConnectedAccount) => {
            return connectedAccount.primary;
          });
          // If no account is marked primary select first one
          return primaryAccount ? primaryAccount.loginHint : account.connectedAccounts[0]['loginHint'];
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
