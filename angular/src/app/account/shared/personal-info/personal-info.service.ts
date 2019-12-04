import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ErrorHandlerService, realmIdPlaceholder } from 'ddap-common-lib';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class PersonalInfoService {

  constructor(private http: HttpClient,
              private errorHandler: ErrorHandlerService) {
  }

  getUserInformation(): Observable<any> {
    return this.http.get<any>(`/identity/scim/v2/${realmIdPlaceholder}/Me`)
      .pipe(
        this.errorHandler.notifyOnError(`Can't load User information.`)
      );
  }

}
