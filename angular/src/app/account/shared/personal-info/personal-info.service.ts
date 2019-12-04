import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ErrorHandlerService, realmIdPlaceholder } from 'ddap-common-lib';
import { Observable } from 'rxjs';
import { environment } from "../../../../environments/environment";
import { PatchUserInfo } from "./patch-user-info.model";

@Injectable({
  providedIn: 'root',
})
export class PersonalInfoService {

  constructor(private http: HttpClient,
              private errorHandler: ErrorHandlerService) {
  }

  getLoggedInUserInformation(): Observable<any> {
    return this.http.get<any>(`${environment.idpBaseUrl}/scim/v2/${realmIdPlaceholder}/Me`)
      .pipe(
        this.errorHandler.notifyOnError(`Can't load User information.`)
      );
  }

  patchLoggedInUserInformation(patchModel: PatchUserInfo): Observable<any> {
    return this.http.patch(<any>(`${environment.idpBaseUrl}/scim/v2/${realmIdPlaceholder}/Me`), patchModel);
  }



}
