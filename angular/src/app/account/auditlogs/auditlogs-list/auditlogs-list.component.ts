import { Component, OnInit } from '@angular/core';

import { UserService } from '../../../shared/users/user.service';

@Component({
  selector: 'ddap-auditlogs-list',
  templateUrl: './auditlogs-list.component.html',
  styleUrls: ['./auditlogs-list.component.scss'],
})
export class AuditlogsListComponent implements OnInit {

  userId: string;

  constructor(private userService: UserService) {
  }

  ngOnInit() {
    this.userService.getLoggedInUser()
      .subscribe((user) => {
        this.userId = user.id;
      });
  }

}
