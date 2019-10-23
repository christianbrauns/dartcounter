import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { PlayerData } from '../player.component';

@Component({
  selector: 'ad-new-player-dialog',
  templateUrl: './new-player-dialog.component.html',
  styleUrls: ['./new-player-dialog.component.scss'],
})
export class NewPlayerDialogComponent {

  constructor(private readonly dialogRef: MatDialogRef<NewPlayerDialogComponent>,
              @Inject(MAT_DIALOG_DATA) public data: PlayerData) {
  }

  public onNoClick(): void {
    this.dialogRef.close();
  }
}
