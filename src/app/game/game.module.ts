import { ScrollingModule } from '@angular/cdk/scrolling';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import {
  MatButtonModule,
  MatCardModule,
  MatFormFieldModule,
  MatIconModule,
  MatInputModule,
  MatSelectModule,
  MatSnackBarModule,
  MatSortModule,
  MatTableModule
} from '@angular/material';
import { RouterModule } from '@angular/router';

import { GameService } from '../services/game.service';
import { GameListComponent } from './game-list/game-list.component';
import { GameComponent } from './game.component';
import { NewGameComponent } from './new-game/new-game.component';
import { ResultComponent } from './result/result.component';
import { MatChipsModule } from '@angular/material/chips';
import { MatBadgeModule } from '@angular/material/badge';

@NgModule({
  declarations: [NewGameComponent, GameComponent, GameListComponent, ResultComponent],
  imports: [
    CommonModule,
    RouterModule.forChild([
      {
        path: '',
        component: GameListComponent
      },
      {
        path: 'new',
        component: NewGameComponent
      },
      {
        path: ':id',
        component: GameComponent
      },
      {
        path: ':id/result',
        component: ResultComponent
      }
    ]),
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    FormsModule,
    ReactiveFormsModule,
    MatIconModule,
    MatButtonModule,
    MatTableModule,
    MatSnackBarModule,
    ScrollingModule,
    MatCardModule,
    MatSortModule,
    MatChipsModule,
    MatBadgeModule
  ],
  providers: [
    {
      provide: GameService,
      useClass: GameService
    }
  ]
})
export class GameModule {}
