import { Component, OnInit } from '@angular/core';

import { InformationService } from '../information.service';

@Component({
  selector: 'ddap-account-info',
  templateUrl: './account-info.component.html',
  styleUrls: ['./account-info.component.scss'],
})
export class AccountInfoComponent implements OnInit {

  accountInfo: any = {};

  constructor(private informationService: InformationService) {}

  ngOnInit() {
    this.informationService.getUserInformation().subscribe(response => this.accountInfo = response);
  }

  transformEmails(emails: any = []) {
    const emailList = [];
    emails.forEach(emailObj => {
      emailList.push(emailObj.value);
    });
    return emailList.join(', ');
  }

  canDisplayDetail(value: any) {
    return !(typeof value === 'object');
  }
}
