import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import ListTokensResponse = tokens.v1.ListTokensResponse;
import { Observable } from 'rxjs';

import { environment } from '../../../environments/environment';
import { tokens } from '../../shared/proto/ic-service';

@Injectable({
  providedIn: 'root',
})
export class TokensService {

  constructor(private http: HttpClient) {
  }

  getTokens(params = {}): Observable<ListTokensResponse> {
    return this.http.get<ListTokensResponse>(`${environment.idpBaseUrl}/tokens`, { params });
  }

  revokeToken(tokenId: string): Observable<null> {
    // FIXME: https://github.com/DNAstack/healthcare-federated-access-services/blob/master/lib/ic/ic.go#L1972
    // FIXME: https://github.com/DNAstack/healthcare-federated-access-services/blob/master/lib/ic/endpoints.go#L72
    // FIXME: will be using proper REST endpoint for delete once tokens fully implemented
    return this.http.delete<any>(`${environment.idpBaseUrl}/tokens/`);
  }

}
