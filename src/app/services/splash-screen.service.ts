import { animate, AnimationBuilder, AnimationPlayer, style } from '@angular/animations';
import { Injectable } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { filter, take, tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class SplashScreenService {

  public set splashElement(value: HTMLElement) {
    this._splashElement = value;
  }

  private _splashElement: HTMLElement;

  constructor(private animationBuilder: AnimationBuilder, private router: Router) {
    router.events.pipe(
      filter((e): e is NavigationEnd => e instanceof NavigationEnd),
      take(1),
      tap(() => this.hide()),
    ).subscribe();
  }

  public hide(): void {
    const player: AnimationPlayer = this.animationBuilder
      .build([style({ opacity: '1' }), animate('600ms ease', style({ opacity: '0' }))])
      .create(this._splashElement);

    player.onDone(() => (this._splashElement.style.display = 'none'));
    player.play();
  }

  public show(): AnimationPlayer {
    const player: AnimationPlayer = this.animationBuilder
      .build([style({ opacity: '0', zIndex: '999999' }), animate('600ms ease', style({ opacity: '1' }))])
      .create(this._splashElement);

    player.onStart(() => (this._splashElement.style.display = ''));
    player.play();

    return player;
  }
}
