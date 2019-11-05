import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { LoadingBarService } from '@ngx-loading-bar/core';
import { interval, Observable } from 'rxjs';
import { repeatWhen } from 'rxjs/operators';

import { IdentityService } from '../identity/identity.service';
import { IdentityStore } from '../identity/identity.store';
import { Profile } from '../identity/profile.model';
import { UserAccess } from '../identity/user-access.model';

const refreshRepeatTimeoutInMs = 600000;

@Component({
  templateUrl: './layout.component.html',
  styleUrls: ['./layout.component.scss'],
})
export class LayoutComponent implements OnInit {

  isSandbox = false;
  profile: Profile = null;
  isIcAdmin = false;
  realm: string;
  loginPath: string;

  constructor(public loader: LoadingBarService,
              private activatedRoute: ActivatedRoute,
              private identityService: IdentityService,
              private identityStore: IdentityStore) {
  }

  ngOnInit() {
    this.identityStore.getIdentity()
      .subscribe(({ account, sandbox }) => {
        this.isSandbox = sandbox;
        this.profile = account.profile;
      });

    this.determineAdminAccessForDamAndIc();

    this.activatedRoute.root.firstChild.params.subscribe((params) => {
      this.realm = params.realmId;
      this.loginPath = `/api/v1alpha/${this.realm}/identity/login`;
    });

    // Workaround to get fresh cookies
    this.periodicallyRefreshTokens()
      .subscribe();
  }

  isActivePanel(panelId: string): boolean {
    const adminRoute = this.activatedRoute.firstChild;
    if (adminRoute) {
      const childRoute = adminRoute.firstChild;
      const icPanelId = 'identity-concentrator';
      return panelId === icPanelId && childRoute.routeConfig.path === icPanelId;
    }
    return false;
  }

  logout() {
    this.identityService.invalidateTokens()
      .subscribe(() => {
        window.location.href = `${this.loginPath}`;
      });
  }

  private determineAdminAccessForDamAndIc() {
    this.identityService.getIcUserAccess()
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
