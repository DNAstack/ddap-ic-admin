import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import IConnectedAccount = ic.v1.IConnectedAccount;
import { any } from 'codelyzer/util/function';
import { ErrorHandlerService, realmIdPlaceholder } from 'ddap-common-lib';
import _get from 'lodash.get';
import { Observable } from 'rxjs';
import { map, pluck } from 'rxjs/operators';

import { environment } from '../../../environments/environment';
import { ic } from '../../shared/proto/ic-service';

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
        this.errorHandler.notifyOnError(`Can't load account's information.`)
      );
  }

  getIdentityProviders(params = {}): Observable<any> {
    return this.http.get<any>(`${environment.idpApiUrl}/${realmIdPlaceholder}/identityProviders`, {params})
      .pipe(
        this.errorHandler.notifyOnError(`Can't load identity providers' information.`),
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

  unlinkConnectedAccount(account: IConnectedAccount) {
    const subjectName = account.properties.subject;
    return this.http.delete<any>(`${environment.ddapApiUrl}/realm/${realmIdPlaceholder}/identity/link/${subjectName}`)
      .subscribe(() => window.location.reload());
  }

  refreshTokens(params?) {
    return this.http.get<any>(`${environment.ddapApiUrl}/realm/${realmIdPlaceholder}/identity/refresh`, {params});
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
          linkUrl: `${environment.ddapApiUrl}/${realm}/identity/link?provider=${idpKey}`,
        };
      });
  }

}
