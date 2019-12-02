import { Component, OnInit } from "@angular/core";
import { ActivatedRoute } from '@angular/router';

import { TokensService } from "../tokens.service";
import { Observable } from "rxjs";
import { tokens } from "../../../shared/proto/token-service";
import ListTokensResponse = tokens.v1.ListTokensResponse;

@Component({
  selector: 'ddap-token-list',
  templateUrl: './token-list.component.html',
  styleUrls: ['./token-list.component.scss'],
})
export class TokenListComponent implements OnInit {

  tokens$: Observable<ListTokensResponse>;

  constructor(protected route: ActivatedRoute,
              private tokenService: TokensService) {
  }

  ngOnInit() {
    this.tokens$ = this.tokenService.getTokens({ pageSize: 20 });
  }

}
