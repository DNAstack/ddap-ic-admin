import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { environment } from '../../../environments/environment';
import { consents } from '../../shared/proto/ic-service';
import ListConsentsResponse = consents.v1.ListConsentsResponse;

@Injectable({
  providedIn: 'root',
})
export class ConsentsService {

  constructor(private http: HttpClient) {
  }

  getConsents(userId: string, params = {}): Observable<ListConsentsResponse> {
    return this.http.get<ListConsentsResponse>(
      `${environment.idpBaseUrl}/identity/v1alpha/users/${encodeURIComponent(userId)}/consents`,
      { params }
    );
  }

  revokeConsent(userId: string, consentId: string): Observable<null> {
    return this.http.delete<any>(
      `${environment.idpBaseUrl}/identity/v1alpha/users/${encodeURIComponent(userId)}/consents/${encodeURIComponent(consentId)}`
    );
  }

}
