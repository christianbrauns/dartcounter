import { Component } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { filter, take, tap } from 'rxjs/operators';

@Component({
  selector: 'ad-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {

  // @ViewChild('splashScreen', { static: true, read: ElementRef })
  // public splashScreen: ElementRef<HTMLElement>;

  public hideSplash: boolean = false;

  constructor(router: Router) {
    router.events.pipe(
      take(1),
      filter((e): e is NavigationEnd => e instanceof NavigationEnd),
      tap(() => this.hideSplash = true),
    ).subscribe();

  }
}
