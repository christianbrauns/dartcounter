import {Component} from '@angular/core';
import {AngularFirestore} from '@angular/fire/firestore';
import {MatDialog} from '@angular/material';
import {Observable} from 'rxjs';
import {map} from 'rxjs/operators';
import {NewPlayerDialogComponent} from './new-player-dialog/new-player-dialog.component';

export interface PlayerData {
  id: string;
  name: string;
  team: string;
}


@Component({
  selector: 'ad-player',
  templateUrl: './player.component.html',
  styleUrls: ['./player.component.scss']
})
export class PlayerComponent {

  public readonly dataSource: Observable<Array<PlayerData>>;
  public displayedColumns: Array<string> = ['name', 'team'];

  constructor(private readonly dialog: MatDialog, private readonly db: AngularFirestore) {
    this.dataSource = this.db.collection<PlayerData>('players').valueChanges({idField: 'id'}).pipe(
      map(value => value.sort((a, b) => a.name.localeCompare(b.name)))
    );
  }

  public editPlayer(playerData: PlayerData): void {
    const dialogRef = this.dialog.open(NewPlayerDialogComponent, {
      width: '300px',
      data: playerData
    });

    dialogRef.afterClosed().subscribe((result: PlayerData) => {
      if (result) {
        this.db.collection('players').doc(playerData.id).update(result).then(r => console.log(r));
      }
    });
  }

  public openDialog(): void {
    const dialogRef = this.dialog.open(NewPlayerDialogComponent, {
      width: '300px',
      data: {name: '', team: ''}
    });

    dialogRef.afterClosed().subscribe((result: PlayerData) => {
      if (result) {
        this.db.collection('players').add(result).then(r => console.log(r));
      }
    });
  }
}
