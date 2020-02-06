import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { LoadingBarService } from '@ngx-loading-bar/core';
import { interval, Observable } from 'rxjs';
import { repeatWhen, share } from "rxjs/operators";

import { Identity } from '../../account/identity/identity.model';
import { IdentityService } from '../../account/identity/identity.service';
import { IdentityStore } from '../../account/identity/identity.store';
import { AuthService } from '../../account/shared/auth/auth.service';
import { UserAccess } from '../../account/shared/auth/user-access.model';
import { scim } from '../proto/user-service';
import { UsersService } from '../users/users.service';
import IUser = scim.v2.IUser;
import IAttribute = scim.v2.IAttribute;

const refreshRepeatTimeoutInMs = 600000;

@Component({
  templateUrl: './layout.component.html',
  styleUrls: ['./layout.component.scss'],
})
export class LayoutComponent implements OnInit {

  userInfo$: Observable<IUser>;

  isSandbox = false;
  isIcAdmin = false;
  realm: string;
  loginPath: string;

  constructor(public loader: LoadingBarService,
              private activatedRoute: ActivatedRoute,
              private usersService: UsersService,
              private identityService: IdentityService,
              private identityStore: IdentityStore,
              private authService: AuthService) {
  }

  ngOnInit() {
    this.userInfo$ = this.usersService.getLoggedInUser();

    this.identityStore.state$
      .subscribe((identity: Identity) => {
        if (!identity) {
          return;
        }
        const { sandbox, account } = identity;
        this.isSandbox = sandbox;
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

  getPrimaryPhoto(photos: IAttribute[]) {
    const primaryPhoto = photos.find((photo) => photo.primary);
    return primaryPhoto ? primaryPhoto.value : '/assets/images/placeholder_identity.png';
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
