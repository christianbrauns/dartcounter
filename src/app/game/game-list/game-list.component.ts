import {Component} from '@angular/core';
import {AngularFirestore} from '@angular/fire/firestore';
import {Observable} from 'rxjs';
import {map, tap} from 'rxjs/operators';
import {getGameCount} from '../../gamerules';
import {reducer} from '../../utils';
import {GameData, PlayerGameData} from '../game.component';

export interface GameDataList extends GameData {
  finished: boolean;
  winner?: PlayerGameData;
}

@Component({
  selector: 'ad-game-list',
  templateUrl: './game-list.component.html',
  styleUrls: ['./game-list.component.scss']
})
export class GameListComponent {
  public readonly dataSource: Observable<Array<GameDataList>>;
  public displayedColumns: Array<string> = ['winner', 'players', 'mode', 'type', 'finished'];

  constructor(private readonly db: AngularFirestore) {
    this.dataSource = this.db.collection<GameData>('games').valueChanges({idField: 'id'}).pipe(
      map((games: Array<GameData>) => games.map((game: GameData) => Object.assign({}, game as GameDataList))),
      tap(value => value.forEach(
        value1 => value1.winner = value1.players.sort(
          (a, b) => b.throws.reduce(reducer, 0) - a.throws.reduce(reducer, 0))[0]
        )
      ),
      tap(x => x.forEach(game => game.finished = game.winner.throws.reduce(reducer, 0) === getGameCount(game.type))),
    );
  }
}
