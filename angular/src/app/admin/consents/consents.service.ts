import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { consents } from '../../shared/proto/consent-service';
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
    return this.http.delete<any>(`${environment.idpBaseUrl}/consents/${consentId}`);
  }

}
