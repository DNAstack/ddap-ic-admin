import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { LoadingBarService } from '@ngx-loading-bar/core';
import { interval, Observable } from 'rxjs';
import { repeatWhen } from 'rxjs/operators';

import { Identity } from '../../account/identity/identity.model';
import { IdentityService } from '../../account/identity/identity.service';
import { IdentityStore } from '../../account/identity/identity.store';
import { AuthService } from '../../account/shared/auth/auth.service';
import { UserAccess } from '../../account/shared/auth/user-access.model';
import { ic } from '../proto/ic-service';
import IAccountProfile = ic.v1.IAccountProfile;
import { RealmService } from '../realm/realm.service';

const refreshRepeatTimeoutInMs = 600000;

@Component({
  templateUrl: './layout.component.html',
  styleUrls: ['./layout.component.scss'],
})
export class LayoutComponent implements OnInit {

  isSandbox = false;
  profile: IAccountProfile = null;
  isIcAdmin = false;
  realm: string;
  loginPath: string;

  constructor(public loader: LoadingBarService,
              private activatedRoute: ActivatedRoute,
              private identityService: IdentityService,
              private identityStore: IdentityStore,
              private authService: AuthService,
              private realmService: RealmService,
              private router: Router) {
  }

  ngOnInit() {
    this.identityStore.state$
      .subscribe((identity: Identity) => {
        if (!identity) {
          return;
        }
        const { sandbox, account } = identity;
        this.isSandbox = true; // sandbox;
        this.profile = account.profile;
      });

    this.determineAdminAccessForIc();

    this.activatedRoute.root.firstChild.params.subscribe((params) => {
      this.realm = params.realmId;
      this.loginPath = `/api/v1alpha/realm/${this.realm}/identity/login`;
    });

    // Workaround to get fresh cookies
    this.periodicallyRefreshTokens()
      .subscribe();
  }

  isUsersRouteActive(): boolean {
    const adminRoute = this.activatedRoute.firstChild;
    if (adminRoute && adminRoute.routeConfig.path === 'admin') {
      return adminRoute.firstChild.routeConfig.path === 'users';
    }
    return false;
  }

  isChildPage(): boolean {
    return !!this.activatedRoute.firstChild;
  }

  logout() {
    this.identityService.invalidateTokens()
      .subscribe(() => {
        window.location.href = `${this.loginPath}`;
      });
  }

  onAcknowledge(dialogData) {
    if (dialogData) {
      if (dialogData.action === 'edit') {
        this.changeRealmAndGoToLogin(dialogData.realm);
      } else if (dialogData.action === 'delete') {
        this.deleteRealm(dialogData.realm);
      }
    }
  }

  private determineAdminAccessForIc() {
    this.authService.getIcUserAccess()
      .subscribe((icAccess: UserAccess) => {
        this.isIcAdmin = icAccess.isAdmin;
      });
  }

  private periodicallyRefreshTokens(): Observable<any> {
    return this.identityService.refreshTokens()
      .pipe(
        repeatWhen(() => interval(refreshRepeatTimeoutInMs))
      );
  }

  private changeRealmAndGoToLogin(realm) {
    this.identityStore.getLoginHintForPrimaryAccount()
      .subscribe((loginHint) => {
        window.location.href = `/api/v1alpha/realm/${realm}/identity/login?loginHint=${loginHint}`;
      });
  }

  private deleteRealm(realm) {
    if (realm !== 'master') {
      this.realmService.deleteRealm(realm).subscribe(() => {
        this.router.navigate(['/master']).then(() => window.location.reload());
      });
    }
  }

}
