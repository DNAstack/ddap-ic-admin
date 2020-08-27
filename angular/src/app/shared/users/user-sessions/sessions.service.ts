import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import ListTokensResponse = tokens.v1.ListTokensResponse;
import { ErrorHandlerService, realmIdPlaceholder } from 'ddap-common-lib';
import { Observable } from 'rxjs';

import { environment } from '../../../../environments/environment';
import { tokens } from '../../proto/ic-service';


@Injectable({
  providedIn: 'root',
})
export class SessionsService {

  constructor(
    private http: HttpClient,
    private errorHandler: ErrorHandlerService
  ) {
  }

  getTokens(userId: string, params = {}): Observable<ListTokensResponse> {
    return this.http.get<ListTokensResponse>(`${environment.ddapApiUrl}`
      + `/realm/${realmIdPlaceholder}/users/${encodeURIComponent(userId)}/tokens`, { params }
      ).pipe(
        this.errorHandler.notifyOnError(`Unable to proceed with the action. Please try again.`, true)
      );
  }

  revokeToken(userId: string, tokenId: string): Observable<null> {
    return this.http.delete<any>(`${environment.idpBaseUrl}/identity/v1alpha`
      + `/users/${encodeURIComponent(userId)}/tokens/${encodeURIComponent(tokenId)}`
    ).pipe(
      this.errorHandler.notifyOnError(`Unable to proceed with the action. Please try again.`, true)
    );
  }

}
