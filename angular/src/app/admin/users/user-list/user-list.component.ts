import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { PageEvent } from '@angular/material/paginator';
import _pick from 'lodash.pick';
import { BehaviorSubject, Observable } from 'rxjs';
import IListUsersResponse = scim.v2.IListUsersResponse;
import { switchMap } from 'rxjs/operators';

import { scim } from '../../../shared/proto/user-service';
import { UsersService } from '../../../shared/users/users.service';
import { UserFilterService } from "./user-filter.service";


@Component({
  selector: 'ddap-user-list',
  templateUrl: './user-list.component.html',
  styleUrls: ['./user-list.component.scss'],
})
export class UserListComponent implements OnInit {

  query: FormControl = new FormControl('');
  activeFilter: FormControl = new FormControl(null);
  users$: Observable<IListUsersResponse>;

  private readonly defaultPageSize = 25;
  private readonly refreshUsers$ = new BehaviorSubject<any>({ startIndex: 1, count: this.defaultPageSize });

  constructor(private userService: UsersService) {
  }

  ngOnInit() {
    this.users$ = this.refreshUsers$.pipe(
      switchMap((params) => this.userService.getUsers(params))
    );
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

  modifyUserData(user: any) {
    let userData: {};
    userData = _pick(user, ['id', 'userName']);
    userData['emails'] = user['emails'].map( email => email.value);
    return userData;
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
