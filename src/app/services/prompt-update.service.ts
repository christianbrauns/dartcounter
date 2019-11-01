import { Injectable } from '@angular/core';
import { SwUpdate } from '@angular/service-worker';
import { Observable } from 'rxjs';
import { map, takeUntil, tap } from 'rxjs/operators';

import { WithDestroy } from '../utils/with-destroy';

@Injectable()
export class PromptUpdateService extends WithDestroy() {

  public hasUpdate: Observable<boolean>;

  constructor(private readonly updates: SwUpdate) {
    super();
    this.hasUpdate = updates.available.pipe(
      takeUntil(this.destroy$),
      map(event => event.available.hash !== event.current.hash),
      tap(() => {
        updates.activateUpdate().then(() => document.location.reload());
      })
    );
  }

  public doUpdate(): void {
    this.updates.activateUpdate().then(() => document.location.reload());
  }
}
