import { AfterViewInit, Component, ElementRef, ViewChild } from '@angular/core';
import { SplashScreenService } from './services/splash-screen.service';

@Component({
  selector: 'ad-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements AfterViewInit {

  @ViewChild('splashScreen', { static: true, read: ElementRef })
  public splashScreen: ElementRef<HTMLElement>;

  constructor(private readonly splash: SplashScreenService) {

  }

  public ngAfterViewInit(): void {
    this.splash.splashElement = this.splashScreen.nativeElement;
  }
}
