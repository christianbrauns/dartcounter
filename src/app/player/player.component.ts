import {Component, OnInit} from '@angular/core';
import {MatDialog} from '@angular/material';
import {NewPlayerDialogComponent} from './new-player-dialog/new-player-dialog.component';
import {AngularFirestore} from '@angular/fire/firestore';
import {Observable} from 'rxjs';

export interface PlayerData {
  team: string;
  name: string;
}


@Component({
  selector: 'ad-player',
  templateUrl: './player.component.html',
  styleUrls: ['./player.component.scss']
})
export class PlayerComponent implements OnInit {

  public readonly dataSource: Observable<Array<PlayerData>>;
  public displayedColumns: Array<string> = ['position', 'name', 'team'];

  private team: string;
  private name: string;

  constructor(private readonly dialog: MatDialog, private readonly db: AngularFirestore) {
    this.dataSource = this.db.collection<PlayerData>('players').valueChanges();
  }

  public ngOnInit() {
  }

  public openDialog(): void {
    const dialogRef = this.dialog.open(NewPlayerDialogComponent, {
      width: '250px',
      data: {name: this.name, team: this.team}
    });

    dialogRef.afterClosed().subscribe((result: PlayerData) => {
      if (result) {
        this.db.collection('players').add(result).then(r => console.log(r));
      }
    });
  }

}
