import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule, MatDialogModule, MatFormFieldModule, MatIconModule, MatInputModule, MatTableModule } from '@angular/material';
import { RouterModule } from '@angular/router';
import { ImageCropperModule } from 'ngx-image-cropper';

import { AvatarComponent } from './avatar/avatar.component';
import { NewPlayerDialogComponent } from './new-player-dialog/new-player-dialog.component';
import { PlayerComponent } from './player.component';

@NgModule({
  declarations: [PlayerComponent, NewPlayerDialogComponent, AvatarComponent],
  imports: [
    CommonModule,
    RouterModule.forChild([
      {
        path: '',
        component: PlayerComponent,
      },
      {
        path: ':id/avatar',
        component: AvatarComponent,
      },
    ]),
    MatButtonModule,
    MatIconModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    FormsModule,
    MatTableModule,
    ImageCropperModule,
  ],
})
export class PlayerModule {
}
