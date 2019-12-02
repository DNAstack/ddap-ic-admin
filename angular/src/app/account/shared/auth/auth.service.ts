import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { realmIdPlaceholder } from 'ddap-common-lib';
import { Observable } from 'rxjs';
import { UserAccess } from "./user-access.model";
import { environment } from "../../../../environments/environment";

@Injectable({
  providedIn: 'root',
})
export class AuthService {

  constructor(private http: HttpClient) {
  }

  getIcUserAccess(params = {}): Observable<UserAccess> {
    return this.http.get<UserAccess>(`${environment.ddapApiUrl}/${realmIdPlaceholder}/identity/access`, {params});
  }

}
