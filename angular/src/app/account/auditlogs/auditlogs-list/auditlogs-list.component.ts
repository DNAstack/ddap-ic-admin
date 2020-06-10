import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable, of } from 'rxjs';
import { map, mergeMap } from 'rxjs/operators';

import { Identity } from '../../identity/identity.model';
import { IdentityStore } from '../../identity/identity.store';
import { AuditlogsService } from '../auditlogs.service';

@Component({
  selector: 'ddap-auditlogs-list',
  templateUrl: './auditlogs-list.component.html',
  styleUrls: ['./auditlogs-list.component.scss'],
})
export class AuditlogsListComponent implements OnInit {

  account;
  auditLogs$: Observable<object[]>;
  pageSize = '20';
  userId: string;
  columnsToDisplay: string[];

  constructor(private auditlogsService: AuditlogsService,
              private identityStore: IdentityStore,
              private router: Router,
              private route: ActivatedRoute) { }

  ngOnInit() {
    this.columnsToDisplay = ['auditlogId', 'type'];
    if (this.route.snapshot.queryParams['userid']) {
      this.userId = this.route.snapshot.queryParams['userid'];
      this.auditlogsService.getLogs(this.userId, this.pageSize)
      .subscribe(result => this.auditLogs$ = this.formatTableData(result['auditLogs']));
    } else {
      this.identityStore.state$.pipe(
        map((identity: Identity) => {
          if (!identity) {
            return;
          }
          const { account } = identity;
          this.account = account;
          return account;
        }),
        mergeMap(account => {
          this.userId = account['sub'];
          return this.auditlogsService.getLogs(this.userId, this.pageSize);
        })
      ).subscribe(result => {
        this.auditLogs$ = this.formatTableData(result['auditLogs']);
      });
    }
  }

  getLogs() {
    this.auditlogsService.getLogs(this.userId, this.pageSize)
      .subscribe(result => this.auditLogs$ = this.formatTableData(result['auditLogs']));
  }

  formatTableData(logs: object[] = []): Observable<object[]> {
    const auditLogs = [];
    logs.map(log => {
      const logDetail = Object.assign({}, log);
      logDetail['auditlogId'] = this.getIdFromName(log['name']);
      auditLogs.push(logDetail);
    });
    return of(auditLogs);
  }

  getIdFromName(name: string): string {
    if (!name || !name.includes('/')) {
      return name;
    }
    return name.substring(name.lastIndexOf('/') + 1);
  }

  gotoAuditlogDetail(log) {
    this.auditlogsService.setCurrentAuditlog(log);
    this.router.navigate([log.auditlogId], {relativeTo: this.route});
  }



}
