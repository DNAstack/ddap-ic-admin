import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ErrorHandlerService, realmIdPlaceholder } from 'ddap-common-lib';
import { Observable } from 'rxjs';
import { environment } from "../../../environments/environment";
import { scim } from "../proto/user-service";
import IPatch = scim.v2.IPatch;
import IListUsersResponse = scim.v2.IListUsersResponse;
import IUser = scim.v2.IUser;

@Injectable({
  providedIn: 'root',
})
export class UsersService {

  constructor(private http: HttpClient,
              private errorHandler: ErrorHandlerService) {
  }

  getLoggedInUser(): Observable<IUser> {
    return this.http.get<IUser>(`${environment.idpBaseUrl}/scim/v2/${realmIdPlaceholder}/Me`)
      .pipe(
        this.errorHandler.notifyOnError(`Can't load User information.`)
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

}
