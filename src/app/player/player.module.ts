import {CommonModule} from '@angular/common';
import {NgModule} from '@angular/core';
import {FormsModule} from '@angular/forms';
import {MatButtonModule, MatDialogModule, MatFormFieldModule, MatIconModule, MatInputModule, MatTableModule} from '@angular/material';
import {RouterModule} from '@angular/router';
import {NewPlayerDialogComponent} from './new-player-dialog/new-player-dialog.component';
import {PlayerComponent} from './player.component';


@NgModule({
  declarations: [PlayerComponent, NewPlayerDialogComponent],
  imports: [
    CommonModule,
    RouterModule.forChild([
      {
        path: '',
        component: PlayerComponent
      }
    ]),
    MatButtonModule,
    MatIconModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    FormsModule,
    MatTableModule,
  ]
})
export class PlayerModule {
}
