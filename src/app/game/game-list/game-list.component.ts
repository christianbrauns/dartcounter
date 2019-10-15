import {Component} from '@angular/core';
import {AngularFirestore} from '@angular/fire/firestore';
import {Observable, Subject} from 'rxjs';
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
  public displayedColumns: Array<string> = ['winner', 'players', 'mode', 'type', 'finished'];
  private readonly _dataSource: Subject<Array<GameDataList>> = new Subject<Array<GameDataList>>();

  constructor(private readonly db: AngularFirestore) {
    let list: Array<GameDataList> = new Array<GameDataList>();
    this.db.collection<GameData>('games').valueChanges({idField: 'id'}).pipe(

    ).subscribe(value => value.forEach(v => this.getPlayers(v.id).subscribe(value1 => {
      v.players = value1;

      list.push(this.calculate(v));

      this._dataSource.next(list);
    })));

  }

  public get dataSource(): Observable<Array<GameDataList>> {
    return this._dataSource.asObservable();
  }

  private calculate(game: GameData): GameDataList {
    const winner: PlayerGameData = game.players.sort((a, b) => a.throws.reduce(reducer, 0) - b.throws.reduce(reducer, 0)).pop();

    const gameList: GameDataList = game as GameDataList;

    gameList.finished = winner.throws.reduce(reducer, 0) === getGameCount(game.type);
    gameList.winner = winner;

    return gameList;
  }

  private getPlayers(id: string): Observable<Array<PlayerGameData>> {
    return this.db.collection('games').doc<GameData>(id).collection<PlayerGameData>('players').valueChanges();
  }
}
