import { Component, OnInit } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { switchMap } from 'rxjs/operators';

import { consents } from '../../../shared/proto/ic-service';
import { ConsentsService } from '../consents.service';
import ListConsentsResponse = consents.v1.ListConsentsResponse;

@Component({
  selector: 'ddap-consent-list',
  templateUrl: './consent-list.component.html',
  styleUrls: ['./consent-list.component.scss'],
})
export class ConsentListComponent implements OnInit {

  displayedColumns: string[] = ['name', 'user', 'client', 'items', 'scopes', 'resources', 'moreActions'];

  consents$: Observable<ListConsentsResponse>;

  private readonly refreshConsents$ = new BehaviorSubject<ListConsentsResponse>(undefined);

  constructor(private consentsService: ConsentsService) {
  }

  ngOnInit() {
    this.consents$ = this.refreshConsents$.pipe(
      switchMap(() => this.consentsService.getConsents({ pageSize: 20 }))
    );
  }

  revokeConsent(consentId: string) {
    this.consentsService.revokeConsent(consentId)
      .subscribe(() => this.refreshConsents$.next(undefined));
  }

}
