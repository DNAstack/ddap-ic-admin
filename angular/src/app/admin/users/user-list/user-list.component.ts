import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import IUser = scim.v2.IUser;
import { MatDialog } from '@angular/material/dialog';
import { PageEvent } from '@angular/material/paginator';
import { BehaviorSubject, EMPTY, Observable } from 'rxjs';
import IListUsersResponse = scim.v2.IListUsersResponse;
import { flatMap, switchMap } from 'rxjs/operators';

import { IdentityService } from '../../../account/identity/identity.service';
import { scim } from '../../../shared/proto/ic-service';
import {
  UserAccountCloseConfirmationDialogComponent
} from '../../../shared/users/user-account-close-confirmation-dialog/user-account-close-confirmation-dialog.component';
import { UserService } from '../../../shared/users/user.service';

import { UserFilterService } from './user-filter.service';


@Component({
  selector: 'ddap-user-list',
  templateUrl: './user-list.component.html',
  styleUrls: ['./user-list.component.scss'],
})
export class UserListComponent implements OnInit {

  displayedColumns: string[] = ['name', 'id', 'status', 'emails', 'moreActions'];

  query: FormControl = new FormControl('');
  activeFilter: FormControl = new FormControl(null);
  loggedInUser: IUser;
  users$: Observable<IListUsersResponse>;

  private readonly defaultPageSize = 25;
  private readonly refreshUsers$ = new BehaviorSubject<any>({ startIndex: 1, count: this.defaultPageSize });

  constructor(private userService: UserService,
              private identityService: IdentityService,
              private dialog: MatDialog) {
  }

  ngOnInit() {
    this.users$ = this.refreshUsers$.pipe(
      switchMap((params) => this.userService.getUsers(params))
    );
    this.userService.getLoggedInUser()
      .subscribe((loggedInUser: IUser) => {
        this.loggedInUser = loggedInUser;
      });
  }

  resetQueryValue(searchInputVisible) {
    if (!searchInputVisible) {
      this.query.reset();
      this.refreshUsers();
    }
  }

  refreshUsers() {
    const query = this.query.value;
    const activeFilter = this.activeFilter.value;
    const params = this.refreshUsers$.getValue();

    if (query && query !== '') {
      params.filter = UserFilterService.appendActiveFilter(UserFilterService.buildFilterQuery(query), activeFilter);
    } else if (activeFilter !== null) {
      params.filter = UserFilterService.buildActiveFilter(activeFilter);
    } else {
      delete params.filter;
    }

    this.refreshUsers$.next(params);
  }

  changePage(page: PageEvent) {
    const params = this.refreshUsers$.getValue();
    params.startIndex = this.getStartIndexBasedOnPageChangeDirection(page, params.count, params.startIndex);
    params.count = page.pageSize;
    this.refreshUsers$.next(params);
  }

  closeAccount(user: IUser) {
    const selfClosing = this.loggedInUser.id === user.id;
    const dialogRef = this.dialog.open(UserAccountCloseConfirmationDialogComponent, {
      data: {
        name: user.displayName,
        selfClosing: selfClosing,
      },
    });
    dialogRef.afterClosed().subscribe((acknowledged) => {
      if (acknowledged) {
        this.userService.deleteUser(user.id)
          .pipe(
            flatMap(() => {
              if (selfClosing) {
                return this.identityService.invalidateTokens();
              } else {
                this.refreshUsers$.next({});
                return EMPTY;
              }
            })
          )
          .subscribe(() => window.location.href = `/`);
      }
    });
  }

  private getStartIndexBasedOnPageChangeDirection(page: PageEvent, previousPageSize: number, previousStartIndex: number): number {
    const { previousPageIndex, pageIndex, pageSize } = page;
    // if page size has changed -> reset start index
    if (previousPageSize !== pageSize) {
      return 1;
    }
    if (previousPageIndex > pageIndex) {
      return previousStartIndex - pageSize;
    }
    if (previousPageIndex < pageIndex) {
      return previousStartIndex + pageSize;
    }
  }

}
