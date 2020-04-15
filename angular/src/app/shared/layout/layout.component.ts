import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { LoadingBarService } from '@ngx-loading-bar/core';
import IUser = scim.v2.IUser;
import IAttribute = scim.v2.IAttribute;
import { ViewControllerService } from 'ddap-common-lib';
import { interval, Observable } from 'rxjs';
import { repeatWhen } from 'rxjs/operators';

import { Identity } from '../../account/identity/identity.model';
import { IdentityService } from '../../account/identity/identity.service';
import { IdentityStore } from '../../account/identity/identity.store';
import { AuthService } from '../../account/shared/auth/auth.service';
import { UserAccess } from '../../account/shared/auth/user-access.model';
import { AppConfigService } from '../app-config/app-config.service';
import { scim } from '../proto/ic-service';
import { UserService } from '../users/user.service';

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
  isLoggedIn = false;

  constructor(public loader: LoadingBarService,
              private activatedRoute: ActivatedRoute,
              private usersService: UserService,
              private identityService: IdentityService,
              private identityStore: IdentityStore,
              private authService: AuthService,
              public viewControllerService: ViewControllerService,
              public appConfigService: AppConfigService) {
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
    const placeholderImage = '/assets/images/placeholder_identity.png';
    if (!photos || photos.length < 1) {
      return placeholderImage;
    }
    const primaryPhoto = photos.find((photo) => photo.primary);
    return primaryPhoto ? primaryPhoto.value : placeholderImage;
  }
  onAcknowledge(dialogData) {
    if (dialogData && dialogData.action === 'edit') {
      this.changeRealmAndGoToLogin(dialogData.realm);
    }
  }

  private determineAdminAccessForIc() {
    this.authService.getIcUserAccess()
      .subscribe((icAccess: UserAccess) => {
        this.isLoggedIn = true;
        this.isIcAdmin = icAccess.isAdmin;
      });
  }

  private periodicallyRefreshTokens(): Observable<any> {
    return this.identityService.refreshTokens()
      .pipe(
        repeatWhen(() => interval(refreshRepeatTimeoutInMs))
      );
  }

  private changeRealmAndGoToLogin(realm: string) {
    this.identityStore.getLoginHintForPrimaryAccount()
      .subscribe((loginHint) => {
        window.location.href = `/api/v1alpha/realm/${realm}/identity/login?loginHint=${loginHint}`;
      });
  }
}
