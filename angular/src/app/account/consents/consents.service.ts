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

  getConsents(params = {}): Observable<ListConsentsResponse> {
    return this.http.get<ListConsentsResponse>(`${environment.idpBaseUrl}/consents`, { params });
  }

  revokeConsent(consentId: string): Observable<null> {
    // FIXME: https://github.com/DNAstack/healthcare-federated-access-services/blob/master/lib/ic/ic.go#L1977
    // FIXME: https://github.com/DNAstack/healthcare-federated-access-services/blob/master/lib/ic/endpoints.go#L76
    // FIXME: will be using proper REST endpoint for delete once consent fully implemented
    return this.http.delete<any>(`${environment.idpBaseUrl}/consents/`);
  }

}
