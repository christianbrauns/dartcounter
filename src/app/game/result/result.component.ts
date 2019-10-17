import {Component} from '@angular/core';
import {AngularFirestore} from '@angular/fire/firestore';
import {ActivatedRoute} from '@angular/router';
import {Observable} from 'rxjs';
import {map, tap} from 'rxjs/operators';
import {reducer} from '../../utils';
import {GameData, PlayerGameData} from '../game.component';

export interface PlayerGameDataResult extends PlayerGameData {
  points: number;
}

@Component({
  selector: 'ad-result',
  templateUrl: './result.component.html',
  styleUrls: ['./result.component.scss']
})
export class ResultComponent {

  public readonly players: Observable<Array<PlayerGameDataResult>>;

  constructor(private readonly db: AngularFirestore, private readonly route: ActivatedRoute) {
    this.players = db.collection('games').doc<GameData>(route.snapshot.paramMap.get('id')).valueChanges().pipe(
      tap(x => console.log(x)),
      map(value => value.players),
      map((players: Array<PlayerGameData>) => players.map((player: PlayerGameData) => Object.assign({}, player as PlayerGameDataResult))),
      tap(value => value.forEach(value1 => value1.points = Number(value1.throws.reduce(reducer, 0)))),
      tap(x => console.log(x)),
      map(value => value.sort(
        (a: PlayerGameDataResult, b: PlayerGameDataResult) => b.points - a.points
      ))
    );
  }


  public getTrownArrows(throws: Array<number>): number {
    return throws.filter(x => x !== null).length;
  }
}
