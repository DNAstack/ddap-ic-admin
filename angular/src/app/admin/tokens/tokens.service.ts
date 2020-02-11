import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import ListTokensResponse = tokens.v1.ListTokensResponse;
import { realmIdPlaceholder } from 'ddap-common-lib';
import { Observable } from 'rxjs';

import { environment } from '../../../environments/environment';
import { tokens } from '../../shared/proto/token-service';

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
    return this.http.delete<any>(`${environment.idpBaseUrl}/tokens/${tokenId}`);
  }

}
