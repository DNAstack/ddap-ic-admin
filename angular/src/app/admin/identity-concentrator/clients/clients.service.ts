import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ConfigModificationModel, ErrorHandlerService, realmIdPlaceholder } from 'ddap-common-lib';
import { Observable } from 'rxjs';

import { environment } from '../../../../environments/environment';
import { IcConfigEntityType } from '../shared/ic/ic-config-entity-type.enum';
import { IcConfigService } from '../shared/ic/ic-config.service';

@Injectable({
  providedIn: 'root',
})
export class ClientService extends IcConfigService {

  constructor(protected http: HttpClient,
              protected route: ActivatedRoute,
              protected errorHandler: ErrorHandlerService) {
    super(IcConfigEntityType.clients, http, errorHandler);
  }

}
