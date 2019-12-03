import { NgModule } from '@angular/core';

import { TokensRoutingModule } from './tokens-routing.module';
import { TokenListComponent } from "./token-list/token-list.component";
import { AccountSharedModule } from "../shared/shared.module";
import { NgJsonEditorModule } from "ang-jsoneditor";

@NgModule({
  declarations: [
    TokenListComponent,
  ],
  imports: [
    AccountSharedModule,
    TokensRoutingModule,
    NgJsonEditorModule,
  ],
})
export class TokensModule {

}
