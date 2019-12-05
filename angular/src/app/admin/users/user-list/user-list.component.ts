import { Component, OnInit } from "@angular/core";
import { BehaviorSubject, Observable } from "rxjs";
import { UsersService } from "../../../shared/users/users.service";
import { scim } from "../../../shared/proto/user-service";
import IListUsersResponse = scim.v2.IListUsersResponse;
import IUser = scim.v2.IUser;
import { switchMap } from "rxjs/operators";
import { FormControl } from "@angular/forms";


@Component({
  selector: 'ddap-user-list',
  templateUrl: './user-list.component.html',
  styleUrls: ['./user-list.component.scss'],
})
export class UserListComponent implements OnInit {

  query: FormControl = new FormControl('');
  users$: Observable<IListUsersResponse>;

  private readonly refreshUsers$ = new BehaviorSubject<any>(undefined);

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
    if (query && query != '') {
      this.refreshUsers$.next({
        filter: `id co "${query}" Or name.formatted co "${query}" Or name.givenName co "${query}" Or name.familyName co "${query}"`
      })
    } else {
      this.refreshUsers$.next(undefined);
    }
  }

}
