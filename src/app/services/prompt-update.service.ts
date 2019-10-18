import {Injectable} from '@angular/core';
import {MatSnackBar, MatSnackBarRef, SimpleSnackBar} from '@angular/material';
import {SwUpdate} from '@angular/service-worker';


@Injectable()
export class PromptUpdateService {

  constructor(updates: SwUpdate, snackBar: MatSnackBar) {
    updates.available.subscribe(event => {

      const snack: MatSnackBarRef<SimpleSnackBar> = snackBar.open('Update verfügbar', 'Reload', {
        duration: 30000,
      });

      snack.onAction()
        .subscribe(() => {
          updates.activateUpdate().then(() => document.location.reload());
        });

    });
  }
}
