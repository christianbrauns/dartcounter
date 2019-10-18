import {Component} from '@angular/core';
import {Observable} from 'rxjs';
import {CheckForUpdateService} from './services/check-for-update.service';
import {PromptUpdateService} from './services/prompt-update.service';

@Component({
  selector: 'ad-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  providers: [PromptUpdateService, CheckForUpdateService]
})
export class AppComponent {

  public hasUpdate: Observable<boolean>;
  public title: string = 'Aurora Dart';

  constructor(private readonly promptUpdateService: PromptUpdateService, private readonly checkForUpdateService: CheckForUpdateService) {
    this.hasUpdate = promptUpdateService.hasUpdate;
  }

  public doUpdate(): void {
    this.promptUpdateService.doUpdate();
  }

  public goToIssues(): void {
    window.open('https://github.com/christianbrauns/dartcounter/issues', '_blank');
  }

}
