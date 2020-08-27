import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import ListConsentsResponse = consents.v1.ListConsentsResponse;
import { ErrorHandlerService, realmIdPlaceholder } from 'ddap-common-lib';
import { Observable } from 'rxjs';

import { environment } from '../../../../environments/environment';
import { consents } from '../../proto/ic-service';

@Injectable({
  providedIn: 'root',
})
export class ConsentsService {

  constructor(
    private http: HttpClient,
    private errorHandler: ErrorHandlerService) {
  }

  getConsents(userId: string, params = {}): Observable<ListConsentsResponse> {
    return this.http.get<ListConsentsResponse>(
      `${environment.idpBaseUrl}/identity/v1alpha/${realmIdPlaceholder}`
      + `/users/${encodeURIComponent(userId)}/consents`,
      { params }
    ).pipe(
        this.errorHandler.notifyOnError(`Unable to proceed with the action. Please try again.`, true)
      );
  }

  revokeConsent(userId: string, consentId: string): Observable<null> {
    return this.http.delete<any>(
      `${environment.idpBaseUrl}/identity/v1alpha/${realmIdPlaceholder}`
      + `/users/${encodeURIComponent(userId)}/consents/${encodeURIComponent(consentId)}`
    ).pipe(
        this.errorHandler.notifyOnError(`Unable to proceed with the action. Please try again.`, true)
      );
  }

}
