import { Directive, OnDestroy, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { DeleteActionConfirmationDialogComponent, FormValidationService } from 'ddap-common-lib';
import { EntityModel } from 'ddap-common-lib';
import _get from 'lodash.get';
import { Subscription } from 'rxjs';
import { map } from 'rxjs/operators';

import { IcConfigEntityFormComponentBase } from './ic-config-entity-form-component.base';
import { IcConfigEntityStore } from './ic-config-entity-store';
import { IcConfigStore } from './ic-config.store';

@Directive()
export abstract class IcConfigEntityDetailComponentBaseDirective<T extends IcConfigEntityStore>
  extends IcConfigEntityFormComponentBase implements OnInit, OnDestroy {

  entity: EntityModel;

  private subscription: Subscription;

  constructor(
    protected route: ActivatedRoute,
    protected router: Router,
    protected validationService: FormValidationService,
    protected icConfigStore: IcConfigStore,
    protected entityIcConfigStore: T,
    protected dialog: MatDialog
  ) {
    super(route, router, validationService);
  }

  get entityId() {
    return this.route.snapshot.params.entityId;
  }

  ngOnInit() {
    this.icConfigStore.init();
    this.subscription = this.entityIcConfigStore.state$
      .pipe(
        map((entities) => {
          if (entities) {
            return entities.get(this.entityId);
          }
        })
      ).subscribe((entity) => {
      this.entity = entity;
    });
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  openConfirmationDialog() {
    this.dialog.open(DeleteActionConfirmationDialogComponent, {
      data: {
        entityName: _get(this.entity, 'dto.ui.label', this.entity.name),
      },
    }).afterClosed()
      .subscribe((response) => {
        if (response?.acknowledged) {
          this.delete();
        }
      });
  }

  protected abstract delete();

}
