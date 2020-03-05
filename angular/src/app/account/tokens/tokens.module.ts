import { NgModule } from '@angular/core';
import { NgJsonEditorModule } from 'ang-jsoneditor';

import { AdminSharedModule } from '../../admin/shared/shared.module';

import { TokenListComponent } from './token-list/token-list.component';
import { TokensRoutingModule } from './tokens-routing.module';

@NgModule({
  declarations: [
    TokenListComponent,
  ],
  imports: [
    AdminSharedModule,
    TokensRoutingModule,
    NgJsonEditorModule,
  ],
})
export class TokensModule {

}
