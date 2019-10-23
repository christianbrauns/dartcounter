import { Component } from '@angular/core';
import { MatDialog } from '@angular/material';
import { Observable } from 'rxjs';
import { PlayerService } from '../services/player.service';
import { NewPlayerDialogComponent } from './new-player-dialog/new-player-dialog.component';

export interface PlayerData {
  id: string;
  name: string;
  photoURL?: string;
  team: string;
}

@Component({
  selector: 'ad-player',
  templateUrl: './player.component.html',
  styleUrls: ['./player.component.scss'],
})
export class PlayerComponent {

  public readonly dataSource: Observable<Array<PlayerData>>;
  public displayedColumns: Array<string> = ['name', 'team', 'avatar'];

  constructor(private readonly dialog: MatDialog, private readonly playerService: PlayerService) {
    this.dataSource = this.playerService.players;
  }

  public editPlayer(playerData: PlayerData): void {
    const dialogRef = this.dialog.open(NewPlayerDialogComponent, {
      width: '300px',
      data: playerData,
    });

    dialogRef.afterClosed().subscribe((result: PlayerData) => {
      if (result) {
        this.playerService.updatePlayer(playerData.id, result);
      }
    });
  }

  public openDialog(): void {
    const dialogRef = this.dialog.open(NewPlayerDialogComponent, {
      width: '300px',
      data: { name: '', team: '' },
    });

    dialogRef.afterClosed().subscribe((result: PlayerData) => {
      if (result) {
        this.playerService.addPlayer(result);
      }
    });
  }
}
