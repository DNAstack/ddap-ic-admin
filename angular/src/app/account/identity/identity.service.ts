import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ErrorHandlerService, realmIdPlaceholder } from 'ddap-common-lib';
import _get from 'lodash.get';
import { Observable } from 'rxjs';
import { map, pluck } from 'rxjs/operators';

import { environment } from '../../../environments/environment';

import { AccountLink } from './account-link.model';
import { Identity } from './identity.model';

@Injectable({
  providedIn: 'root',
})
export class IdentityService {

  constructor(private http: HttpClient,
              private errorHandler: ErrorHandlerService,
              private activatedRoute: ActivatedRoute) {
  }

  getIdentity(params = {}): Observable<Identity> {
    return this.http.get<any>(`${environment.ddapApiUrl}/realm/${realmIdPlaceholder}/identity`, {params})
      .pipe(
        this.errorHandler.notifyOnError(`Can't load account's information.`, true)
      );
  }

  getIdentityProviders(params = {}): Observable<any> {
    return this.http.get<any>(`${environment.idpApiUrl}/${realmIdPlaceholder}/identityProviders`, {params})
      .pipe(
        this.errorHandler.notifyOnError(`Can't load identity providers' information.`, true),
        pluck('identityProviders')
      );
  }

  getAccountLinks(params?): Observable<AccountLink[]> {
    const realmId = this.activatedRoute.root.firstChild.snapshot.params.realmId;
    return this.getIdentityProviders(params)
      .pipe(
        map((idps) => {
          return [
            ...this.getAccountLinksFromProviders(idps, realmId),
          ];
        })
      );
  }

  refreshTokens(params?) {
    return this.http.get<any>(`${environment.ddapApiUrl}/realm/${realmIdPlaceholder}/identity/refresh`, {params})
      .pipe(
        this.errorHandler.notifyOnError(`Unable to proceed with the action. Please try again.`, true)
      );
  }

  invalidateTokens(params?) {
    return this.http.get<any>(`${environment.ddapApiUrl}/realm/${realmIdPlaceholder}/identity/logout`, {params});
  }

  private getAccountLinksFromProviders(idps: object, realm: string): AccountLink[] {
    return Object.entries(idps)
      .map(([idpKey, idpValue]) => {
        return {
          provider: idpKey,
          label: _get(idpValue, 'ui.label', idpKey),
          linkUrl: `${environment.ddapApiUrl}/realm/${realm}/identity/link?provider=${idpKey}:`, // DISCO-2710 ':' is needed as a workaround
        };
      });
  }

}
