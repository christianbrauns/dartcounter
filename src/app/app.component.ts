import {CdkScrollable, ScrollDispatcher} from '@angular/cdk/overlay';
import {Component, NgZone} from '@angular/core';
import {map, tap} from 'rxjs/operators';

@Component({
  selector: 'ad-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  public shrinkToolbar: boolean = false;
  public title: string = 'Aurora Dart';
  private readonly SHRINK_TOP_SCROLL_POSITION = 5;

  constructor(private scrollDispatcher: ScrollDispatcher,
              private ngZone: NgZone) {
    this.scrollDispatcher.scrolled()
      .pipe(
        map((event: CdkScrollable) => this.getScrollPosition(event)),
        tap(scrollTop => this.ngZone.run(() => this.shrinkToolbar = scrollTop > this.SHRINK_TOP_SCROLL_POSITION))
      )
      .subscribe();
  }

  private getScrollPosition(event: CdkScrollable): number {
    if (event) {
      return event.getElementRef().nativeElement.scrollTop;
    } else {
      return window.scrollY;
    }
  }

}
