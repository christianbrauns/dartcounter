import {CommonModule} from '@angular/common';
import {NgModule} from '@angular/core';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {MatButtonModule, MatFormFieldModule, MatIconModule, MatInputModule, MatSelectModule} from '@angular/material';
import {RouterModule} from '@angular/router';
import {GameComponent} from './game.component';
import {NewGameComponent} from './new-game/new-game.component';


@NgModule({
  declarations: [NewGameComponent, GameComponent],
  imports: [
    CommonModule,
    RouterModule.forChild([
      {
        path: '',
        component: NewGameComponent
      },
      {
        path: ':id',
        component: GameComponent
      }
    ]),
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    FormsModule,
    ReactiveFormsModule,
    MatIconModule,
    MatButtonModule,
  ]
})
export class GameModule {
}
