import { Directive, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { DeleteActionConfirmationDialogComponent, EntityModel } from 'ddap-common-lib';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { IcConfigEntityComponentBase } from './ic-config-entity-component.base';
import { IcConfigEntityStore } from './ic-config-entity-store';
import { IcConfigStore } from './ic-config.store';

@Directive()
export abstract class IcConfigEntityListComponentBaseDirective<T extends IcConfigEntityStore>
  extends IcConfigEntityComponentBase
  implements OnInit {

  entities$: Observable<EntityModel[]>;

  constructor(
    protected icConfigStore: IcConfigStore,
    protected entityIcConfigStore: T,
    protected dialog: MatDialog
  ) {
    super();
  }

  ngOnInit() {
    this.icConfigStore.init();
    this.entities$ = this.entityIcConfigStore.state$
      .pipe(
        map(EntityModel.arrayFromMap)
      );
  }

  openDeleteConfirmationDialog(id: string, label?: string) {
    this.dialog.open(DeleteActionConfirmationDialogComponent, {
      data: {
        entityName: label ? label : id,
      },
    }).afterClosed()
      .subscribe((response) => {
        if (response?.acknowledged) {
          this.delete(id);
        }
      });
  }

  protected abstract delete(id: string): void;

}
