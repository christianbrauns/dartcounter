import {Component} from '@angular/core';

@Component({
  selector: 'ad-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  public title: string = 'Aurora Dart';

  public goToIssues(): void {
    window.open('https://github.com/christianbrauns/dartcounter/issues', '_blank');
  }
}
