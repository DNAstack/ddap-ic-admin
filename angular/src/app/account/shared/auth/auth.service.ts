import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ErrorHandlerService, realmIdPlaceholder } from 'ddap-common-lib';
import { Observable } from 'rxjs';

import { environment } from '../../../../environments/environment';

import { UserAccess } from './user-access.model';

@Injectable({
  providedIn: 'root',
})
export class AuthService {

  constructor(
    private http: HttpClient,
    private errorHandler: ErrorHandlerService
  ) {
  }

  getIcUserAccess(params = {}): Observable<UserAccess> {
    return this.http.get<UserAccess>(`${environment.ddapApiUrl}/realm/${realmIdPlaceholder}/identity/access`, {params})
      .pipe(
        this.errorHandler.notifyOnError(`Unable to proceed with the action. Please try again.`, true)
      );
  }

}
