import {Component, OnInit} from '@angular/core';
import {AngularFirestore} from '@angular/fire/firestore';
import {Observable} from 'rxjs';
import {GameData} from '../game.component';

@Component({
  selector: 'ad-game-list',
  templateUrl: './game-list.component.html',
  styleUrls: ['./game-list.component.scss']
})
export class GameListComponent implements OnInit {

  public readonly dataSource: Observable<Array<GameData>>;
  public displayedColumns: Array<string> = ['id', 'mode', 'type', 'players'];

  constructor(private readonly db: AngularFirestore) {
    this.dataSource = this.db.collection<GameData>('games').valueChanges({idField: 'id'});
  }

  public ngOnInit() {
  }

}
