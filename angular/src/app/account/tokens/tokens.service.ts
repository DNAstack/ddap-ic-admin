import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { environment } from '../../../environments/environment';
import { tokens } from "../../shared/proto/token-service";
import ListTokensResponse = tokens.v1.ListTokensResponse;

@Injectable({
  providedIn: 'root',
})
export class TokensService {

  constructor(private http: HttpClient) {
  }

  getTokens(params = {}): Observable<ListTokensResponse> {
    return this.http.get<any>(`${environment.ddapApiUrl}/tokens`, { params });
  }

}
