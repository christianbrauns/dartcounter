import { Injectable } from '@angular/core';
import { MatSnackBar, MatSnackBarRef, SimpleSnackBar } from '@angular/material';
import { SwUpdate } from '@angular/service-worker';
import { Observable } from 'rxjs';
import { map, takeUntil, tap } from 'rxjs/operators';

import { WithDestroy } from '../utils/with-destroy';

@Injectable()
export class PromptUpdateService extends WithDestroy() {

  public hasUpdate: Observable<boolean>;

  constructor(private readonly updates: SwUpdate, snackBar: MatSnackBar) {
    super();
    this.hasUpdate = updates.available.pipe(
      takeUntil(this.destroy$),
      map(event => event.available.hash !== event.current.hash),
      tap(() => {
        const snack: MatSnackBarRef<SimpleSnackBar> = snackBar.open('Update verfügbar!', 'Update starten', {
          duration: 10000,
        });

        snack.onAction()
          .subscribe(() => {
            updates.activateUpdate().then(() => document.location.reload());
          });

      }),
    );
  }

  public doUpdate(): void {
    this.updates.activateUpdate().then(() => document.location.reload());
  }
}
