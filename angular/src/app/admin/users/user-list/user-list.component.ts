import { Component, OnInit } from "@angular/core";
import { Observable } from "rxjs";
import { UsersService } from "../../../shared/users/users.service";
import { scim } from "../../../shared/proto/user-service";
import IListUsersResponse = scim.v2.IListUsersResponse;
import IUser = scim.v2.IUser;


@Component({
  selector: 'ddap-user-list',
  templateUrl: './user-list.component.html',
  styleUrls: ['./user-list.component.scss'],
})
export class UserListComponent implements OnInit {

  users$: Observable<IListUsersResponse>;

  constructor(private userService: UsersService) {
  }

  ngOnInit() {
    this.users$ = this.userService.getUsers();
  }

}
