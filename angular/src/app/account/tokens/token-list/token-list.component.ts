import { Component, OnInit } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import ListTokensResponse = tokens.v1.ListTokensResponse;
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

  readonly displayedColumns: string[] = ['name', 'subject', 'issuer', 'scopes', 'expiresAt', 'issuedAt', 'client', 'moreActions'];

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

  // Example of 'name' 'users/ic_ba090f2bb80c42bc9e73263b145/tokens/hydra:ZDlhYTA1MzYtYmRmYS00ZmZjLTg1MDctMjA1ZDk2MDY5MjIy'
  // where last part is 'id'
  getIdFromName(name: string): string {
    if (!name || !name.includes('/')) {
      return name;
    }
    return name.substring(name.lastIndexOf('/') + 1);
  }

}
