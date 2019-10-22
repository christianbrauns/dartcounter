import { Component } from '@angular/core';
import { DocumentReference } from '@angular/fire/firestore';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { map, tap } from 'rxjs/operators';
import { PlayerData } from '../../player/player.component';
import { GameService } from '../../services/game.service';
import { PlayerService } from '../../services/player.service';
import { reducer } from '../../utils/utils';
import { PlayerGameData } from '../game.component';

export interface PlayerGameDataResult extends PlayerGameData {
  points: number;
}

@Component({
  selector: 'ad-result',
  templateUrl: './result.component.html',
  styleUrls: ['./result.component.scss'],
})
export class ResultComponent {

  public readonly players: Observable<Array<PlayerGameDataResult>>;

  constructor(private readonly gameService: GameService, private readonly route: ActivatedRoute,
              private readonly playerService: PlayerService) {
    this.players = gameService.getGameById(route.snapshot.paramMap.get('id')).pipe(
      map(value => value.players),
      map((players: Array<PlayerGameData>) => players.map((player: PlayerGameData) => Object.assign({}, player as PlayerGameDataResult))),
      tap(value => value.forEach(value1 => value1.points = Number(value1.throws.reduce(reducer, 0)))),
      map(value => value.sort(
        (a: PlayerGameDataResult, b: PlayerGameDataResult) => b.points - a.points,
      )),
    );
  }

  public getPlayerByRef(playerRef: DocumentReference): Observable<PlayerData> | undefined {
    if (playerRef) {
      return this.playerService.getPlayer(playerRef.id);
    } else {
      return undefined;
    }
  }

  public getThrownArrows(throws: Array<number | string>): number {
    return throws.filter(x => x !== null).length;
  }
}
