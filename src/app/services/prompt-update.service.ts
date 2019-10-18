import {Injectable} from '@angular/core';
import {MatSnackBar, MatSnackBarRef, SimpleSnackBar} from '@angular/material';
import {SwUpdate} from '@angular/service-worker';
import {Observable} from 'rxjs';
import {map, tap} from 'rxjs/operators';


@Injectable()
export class PromptUpdateService {

  public hasUpdate: Observable<boolean>;

  constructor(private readonly updates: SwUpdate, snackBar: MatSnackBar) {
    this.hasUpdate = updates.available.pipe(
      map(event => event.available.hash !== event.current.hash),
      tap(() => {
        const snack: MatSnackBarRef<SimpleSnackBar> = snackBar.open('Update verfügbar', 'Reload', {
          duration: 30000,
        });

        snack.onAction()
          .subscribe(() => {
            updates.activateUpdate().then(() => document.location.reload());
          });

      })
    );
  }

  public doUpdate(): void {
    this.updates.activateUpdate().then(() => document.location.reload());
  }
}
