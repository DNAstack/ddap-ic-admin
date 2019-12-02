import { NgModule } from '@angular/core';

import { TokensRoutingModule } from './tokens-routing.module';
import { TokenListComponent } from "./token-list/token-list.component";
import { AccountSharedModule } from "../shared/shared.module";

@NgModule({
  declarations: [
    TokenListComponent,
  ],
  imports: [
    AccountSharedModule,
    TokensRoutingModule,
  ],
})
export class TokensModule {

}
