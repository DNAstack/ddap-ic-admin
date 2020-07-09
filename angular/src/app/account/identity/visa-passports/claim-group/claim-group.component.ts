import { Component, Input } from '@angular/core';
import * as dayjs_ from 'dayjs';
import * as relativeTimePlugin_ from 'dayjs/plugin/relativeTime';

import { VisaPassportService } from '../visa-passport.service';
const dayjs = dayjs_;
const relativeTimePlugin = relativeTimePlugin_;


@Component({
  selector: 'ddap-claim-group',
  templateUrl: './claim-group.component.html',
  styleUrls: ['./claim-group.component.scss'],
})
export class ClaimGroupComponent {

  @Input()
  claimGroupLabel: string;
  @Input()
  ga4ghPassports: any[];

  constructor(public visaPassportService: VisaPassportService) {
    dayjs.extend(relativeTimePlugin);
  }

  getFormattedExpiresTextFromPassport({ exp }: any): string {
    if (!exp) {
      return;
    }

    const timestamp = dayjs.unix(exp);
    const relativeTime = timestamp.fromNow();
    return timestamp.isBefore(dayjs())
      ? `Expired ${relativeTime}`
      : `Expires ${relativeTime}`;
  }

}
