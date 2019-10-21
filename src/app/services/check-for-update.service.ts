import { ApplicationRef, Injectable } from '@angular/core';
import { SwUpdate } from '@angular/service-worker';
import { concat, interval } from 'rxjs';
import { first, takeUntil } from 'rxjs/operators';
import { WithDestroy } from '../utils/with-destroy';

@Injectable()
export class CheckForUpdateService extends WithDestroy() {

  constructor(appRef: ApplicationRef, updates: SwUpdate) {
    super();
    if (!updates.isEnabled) {
      return;
    }
    // Allow the app to stabilize first, before starting polling for updates with `interval()`.
    const appIsStable$ = appRef.isStable.pipe(first(isStable => isStable === true));
    const everySixHours$ = interval(6 * 60 * 60 * 1000);
    const everySixHoursOnceAppIsStable$ = concat(appIsStable$, everySixHours$);

    everySixHoursOnceAppIsStable$.pipe(takeUntil(this.destroy$)).subscribe(() => updates.checkForUpdate());
  }
}
