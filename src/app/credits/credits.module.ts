import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { CreditsComponent } from './credits.component';


@NgModule({
  declarations: [CreditsComponent],
  imports: [
    CommonModule,
    RouterModule.forChild([
      {
        path: '',
        component: CreditsComponent
      }
    ])
  ]
})
export class CreditsModule {
}
