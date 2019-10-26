import { OnDestroy } from '@angular/core';
import { Subject } from 'rxjs';

// https://hackernoon.com/harnessing-the-power-of-mixins-in-angular-faox230fk

/**
 * mixin to auto unsubscribe
 * usage: pipe(
 *          takeUntil(this.destroy$),
 *        )
 *
 *
 * if you are using OnDestroy don't forget to call super.ngOnDestroy();
 */

type Constructor<T> = new(...args: Array<any>) => T;

export const WithDestroy: Function = <T1 extends Constructor<{}>>(Base: T1 = (class T2 {
} as any)) => {

    return class extends Base implements OnDestroy {
        protected destroy$: Subject<void> = new Subject<void>();

        public ngOnDestroy(): void {
            // this is really silly and hacky way of trying to call a potential ngOnDestroy hook defined in custom base class
            // instanceof isn't working for interfaces...
            // you'll find other solutions but those are based on properties, here we have only a method...
            try {
                // @ts-ignore
                (Base.prototype as OnDestroy).ngOnDestroy();
            } catch (BaseIsNotInstanceOfOnDestroy) {
                // can be ignored since it is just fine... in almost every case the `Base` won't implement `OnDestroy`
            }
            this.destroy$.next();
            this.destroy$.complete();
        }
    };
};
