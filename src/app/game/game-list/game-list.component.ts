import { Component } from '@angular/core';
import { DocumentReference } from '@angular/fire/firestore';
import { Sort } from '@angular/material';
import { Observable } from 'rxjs';
import { map, tap } from 'rxjs/operators';
import { getGameCount } from '../../gamerules';
import { PlayerData } from '../../player/player.component';
import { GameService } from '../../services/game.service';
import { PlayerService } from '../../services/player.service';
import { reducer } from '../../utils/utils';
import { GameData, PlayerGameData } from '../game.component';

export interface GameDataList extends GameData {
  finished: boolean;
  winner?: PlayerGameData;
}

@Component({
  selector: 'ad-game-list',
  templateUrl: './game-list.component.html',
  styleUrls: ['./game-list.component.scss'],
})
export class GameListComponent {
  public readonly dataSource: Observable<Array<GameDataList>>;
  public displayedColumns: Array<string> = ['winner', 'players', 'mode', 'type', 'finished', 'date'];

  constructor(private readonly gameService: GameService, private readonly playerService: PlayerService) {
    this.dataSource = gameService.getGames().pipe(
      map((games: Array<GameData>) => games.map((game: GameData) => Object.assign({}, game as GameDataList))),
      // find winner
      tap(value => value.forEach(
        value1 => value1.winner = value1.players.sort(
          (a, b) => Number(b.throws.reduce(reducer, 0)) - Number(a.throws.reduce(reducer, 0)))[0],
        ),
      ),
      tap(x => x.forEach(game => game.finished = game.winner.throws.reduce(reducer, 0) === getGameCount(game.type))),
      map(value => value.sort((a, b) => b.date.toMillis() - a.date.toMillis())),
    );
  }

  public getPlayerByRef(playerRef: DocumentReference): Observable<PlayerData> | undefined {
    if (playerRef) {
      return this.playerService.getPlayer(playerRef.id);
    } else {
      return undefined;
    }
  }

  public sortData($event: Sort) {

  }
}
