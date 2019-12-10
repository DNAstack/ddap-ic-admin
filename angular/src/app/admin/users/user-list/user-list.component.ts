import { Component, OnInit } from "@angular/core";
import { BehaviorSubject, Observable } from "rxjs";
import { UsersService } from "../../../shared/users/users.service";
import { scim } from "../../../shared/proto/user-service";
import IListUsersResponse = scim.v2.IListUsersResponse;
import { switchMap } from "rxjs/operators";
import { FormControl } from "@angular/forms";
import { PageEvent } from "@angular/material/paginator";


@Component({
  selector: 'ddap-user-list',
  templateUrl: './user-list.component.html',
  styleUrls: ['./user-list.component.scss'],
})
export class UserListComponent implements OnInit {

  query: FormControl = new FormControl('');
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
    const params = this.refreshUsers$.getValue();
    if (query && query != '') {
      params.filter = `id co "${query}" Or name.formatted co "${query}" Or name.givenName co "${query}" Or name.familyName co "${query}"`;
      this.refreshUsers$.next(params)
    } else {
      delete params.filter;
      this.refreshUsers$.next(params);
    }
  }

  changePage(page: PageEvent) {
    const params = this.refreshUsers$.getValue();
    params.startIndex = this.getStartIndexBasedOnPageChangeDirection(page, params.count, params.startIndex);
    params.count = page.pageSize;
    this.refreshUsers$.next(params);
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
