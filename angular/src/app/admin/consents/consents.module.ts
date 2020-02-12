import { NgModule } from '@angular/core';
import { NgJsonEditorModule } from 'ang-jsoneditor';

import { AdminSharedModule } from '../shared/shared.module';

import { ConsentListComponent } from './consent-list/consent-list.component';
import { ConsentsRoutingModule } from './consents-routing.module';
import { MatListModule } from "@angular/material/list";

@NgModule({
  declarations: [
    ConsentListComponent,
  ],
  imports: [
    AdminSharedModule,
    ConsentsRoutingModule,
    NgJsonEditorModule,
    MatListModule,
  ],
})
export class ConsentsModule {

}
