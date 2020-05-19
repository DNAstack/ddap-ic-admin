import { Component, OnInit } from '@angular/core';
import { ellipseIfLongerThan } from 'ddap-common-lib';
import { BehaviorSubject, Observable } from 'rxjs';
import ListTokensResponse = tokens.v1.ListTokensResponse;
import IToken = tokens.v1.IToken;
import { flatMap, switchMap } from 'rxjs/operators';

import { tokens } from '../../../shared/proto/ic-service';
import { UserService } from '../../../shared/users/user.service';
import { TokensService } from '../tokens.service';

@Component({
  selector: 'ddap-token-list',
  templateUrl: './token-list.component.html',
  styleUrls: ['./token-list.component.scss'],
})
export class TokenListComponent implements OnInit {

  readonly displayedColumns: string[] = ['type', 'subject', 'issuer', 'scopes', 'expiresAt', 'issuedAt', 'client', 'moreActions'];
  readonly ellipseIfLongerThan: Function = ellipseIfLongerThan;

  tokens$: Observable<ListTokensResponse>;

  private readonly refreshTokens$ = new BehaviorSubject<ListTokensResponse>(undefined);

  constructor(
    private tokenService: TokensService,
    private userService: UserService
  ) {
  }

  ngOnInit() {
    this.tokens$ = this.userService.getLoggedInUser()
      .pipe(
        flatMap((user) => {
          return this.refreshTokens$.pipe(
            switchMap(() => this.tokenService.getTokens(user.id))
          );
        })
      );
  }

  revokeToken(tokenId: string) {
    this.userService.getLoggedInUser()
      .pipe(
        flatMap((user) => this.tokenService.revokeToken(user.id, tokenId))
      )
      .subscribe(() => this.refreshTokens$.next(undefined));
  }

}
