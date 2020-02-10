import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ErrorHandlerService, realmIdPlaceholder } from 'ddap-common-lib';
import { Observable } from 'rxjs';
import IPatch = scim.v2.IPatch;
import IListUsersResponse = scim.v2.IListUsersResponse;
import IUser = scim.v2.IUser;
import { share } from 'rxjs/operators';

import { environment } from '../../../environments/environment';
import { scim } from '../proto/user-service';

@Injectable({
  providedIn: 'root',
})
export class UserService {

  constructor(private http: HttpClient,
              private errorHandler: ErrorHandlerService) {
  }

  getLoggedInUser(): Observable<IUser> {
    return this.http.get<IUser>(`${environment.idpBaseUrl}/scim/v2/${realmIdPlaceholder}/Me`)
      .pipe(
        this.errorHandler.notifyOnError(`Can't load User information.`),
        share()
      );
  }

  patchLoggedInUser(patchModel: IPatch): Observable<IUser> {
    return this.http.patch<IUser>(`${environment.idpBaseUrl}/scim/v2/${realmIdPlaceholder}/Me`, patchModel);
  }

  getUsers(params = {}): Observable<IListUsersResponse> {
    return this.http.get<IListUsersResponse>(`${environment.idpBaseUrl}/scim/v2/${realmIdPlaceholder}/Users`, { params })
      .pipe(
        this.errorHandler.notifyOnError(`Can't load users.`)
      );
  }

  getUser(userId: string): Observable<IUser> {
    return this.http.get<IUser>(`${environment.idpBaseUrl}/scim/v2/${realmIdPlaceholder}/Users/${userId}`)
      .pipe(
        this.errorHandler.notifyOnError(`Can't load user.`)
      );
  }

  patchUser(userId: string, patchModel: IPatch): Observable<IUser> {
    return this.http.patch<IUser>(`${environment.idpBaseUrl}/scim/v2/${realmIdPlaceholder}/Users/${userId}`, patchModel);
  }

  deleteUser(userId: string): Observable<void> {
    return this.http.delete<void>(`${environment.idpBaseUrl}/scim/v2/${realmIdPlaceholder}/Users/${userId}`);
  }

}