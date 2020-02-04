import { Component, OnInit } from '@angular/core';
import _get from 'lodash.get';
import _pick from 'lodash.pick';
import { BehaviorSubject, Observable } from 'rxjs';
import ListTokensResponse = tokens.v1.ListTokensResponse;
import IToken = tokens.v1.IToken;
import { switchMap } from 'rxjs/operators';

import { tokens } from '../../../shared/proto/token-service';
import { TokensService } from '../tokens.service';

@Component({
  selector: 'ddap-token-list',
  templateUrl: './token-list.component.html',
  styleUrls: ['./token-list.component.scss'],
})
export class TokenListComponent implements OnInit {

  tokens$: Observable<ListTokensResponse>;

  private readonly refreshTokens$ = new BehaviorSubject<ListTokensResponse>(undefined);

  constructor(private tokenService: TokensService) {
  }

  ngOnInit() {
    this.tokens$ = this.refreshTokens$.pipe(
      switchMap(() => this.tokenService.getTokens({ pageSize: 20 }))
    );
  }

  revokeToken(token: IToken) {
    this.tokenService.revokeToken(token.name)
      .subscribe(() => this.refreshTokens$.next(undefined));
  }

  getTokenData(token: tokens.v1.IToken) {
    return _pick(token, ['aud', 'exp', 'iat', 'scope', 'target']);
  }

  getClientData(token: tokens.v1.IToken) {
    return _get(token, 'client');
  }
}
