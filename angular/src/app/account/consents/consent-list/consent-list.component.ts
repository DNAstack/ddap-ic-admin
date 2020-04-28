import { Component, OnInit } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { flatMap, switchMap } from 'rxjs/operators';

import { consents } from '../../../shared/proto/ic-service';
import { UserService } from '../../../shared/users/user.service';
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

  constructor(
    private consentsService: ConsentsService,
    private userService: UserService
  ) {
  }

  ngOnInit() {
    this.consents$ = this.userService.getLoggedInUser()
      .pipe(
        flatMap((user) => {
          return this.refreshConsents$.pipe(
            switchMap(() => this.consentsService.getConsents(user.id, { pageSize: 20 }))
          );
        })
      );
  }

  revokeConsent(consentId: string): void {
    this.userService.getLoggedInUser()
      .pipe(
        flatMap((user) => this.consentsService.revokeConsent(user.id, consentId))
      )
      .subscribe(() => this.refreshConsents$.next(undefined));
  }

}
