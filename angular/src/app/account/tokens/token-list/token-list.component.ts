import { Component, OnInit } from "@angular/core";

import { TokensService } from "../tokens.service";
import { BehaviorSubject, Observable } from "rxjs";
import { tokens } from "../../../shared/proto/token-service";
import ListTokensResponse = tokens.v1.ListTokensResponse;
import IToken = tokens.v1.IToken;
import { switchMap } from "rxjs/operators";

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

}
