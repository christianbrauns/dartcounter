import {CommonModule} from '@angular/common';
import {NgModule} from '@angular/core';
import {MatButtonModule} from '@angular/material';
import {RouterModule} from '@angular/router';
import {StartComponent} from './start.component';


@NgModule({
  declarations: [StartComponent],
  imports: [
    CommonModule,
    RouterModule.forChild([
      {
        path: '',
        component: StartComponent
      }
    ]),
    MatButtonModule
  ]
})
export class StartModule {
}
