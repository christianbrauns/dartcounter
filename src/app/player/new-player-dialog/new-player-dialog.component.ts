import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { ActivatedRoute, Router } from '@angular/router';
import { PlayerData } from '../player.component';

@Component({
  selector: 'ad-new-player-dialog',
  templateUrl: './new-player-dialog.component.html',
  styleUrls: ['./new-player-dialog.component.scss'],
})
export class NewPlayerDialogComponent {

  constructor(private readonly dialogRef: MatDialogRef<NewPlayerDialogComponent>, private readonly route: ActivatedRoute,
              @Inject(MAT_DIALOG_DATA) public data: PlayerData, private readonly router: Router) {
  }

  // public addAvatar(): void {
  //   this.router.navigate([this.data.id, 'avatar'], { relativeTo: this.route });
  // }

  public onNoClick(): void {
    this.dialogRef.close();
  }
}
