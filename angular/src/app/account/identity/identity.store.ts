import { Injectable } from '@angular/core';
import { Store } from 'ddap-common-lib';
import { Observable } from 'rxjs';
import { map, pluck } from 'rxjs/operators';

import { Identity } from './identity.model';
import { IdentityService } from './identity.service';
import { ic } from "../../shared/proto/ic-service";
import Account = ic.v1.Account;
import ConnectedAccount = ic.v1.ConnectedAccount;

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
          const username = account.profile.username;
          const primaryAccount: any = account.connectedAccounts.find((connectedAccount: ConnectedAccount) => {
            return connectedAccount.profile.username === username;
          });
          return primaryAccount.loginHint;
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
