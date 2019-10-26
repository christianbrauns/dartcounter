import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'ad-start',
  templateUrl: './start.component.html',
  styleUrls: ['./start.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class StartComponent {}
