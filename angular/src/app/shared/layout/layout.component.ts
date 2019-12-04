import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { LoadingBarService } from '@ngx-loading-bar/core';
import { interval, Observable } from 'rxjs';
import { repeatWhen } from 'rxjs/operators';

import { IdentityService } from '../../account/identity/identity.service';
import { IdentityStore } from '../../account/identity/identity.store';
import { UserAccess } from '../../account/shared/auth/user-access.model';
import { Identity } from "../../account/identity/identity.model";
import { AuthService } from "../../account/shared/auth/auth.service";
import { ic } from "../proto/ic-service";
import IAccountProfile = ic.v1.IAccountProfile;

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
              private authService: AuthService) {
  }

  ngOnInit() {
    this.identityStore.state$
      .subscribe((identity: Identity) => {
        if (!identity) {
          return;
        }
        const { sandbox, account } = identity;
        this.isSandbox = sandbox;
        this.profile = account.profile;
      });

    this.determineAdminAccessForIc();

    this.activatedRoute.root.firstChild.params.subscribe((params) => {
      this.realm = params.realmId;
      this.loginPath = `/api/v1alpha/${this.realm}/identity/login`;
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

}
