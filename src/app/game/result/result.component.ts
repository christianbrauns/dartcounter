import {Component} from '@angular/core';
import {AngularFirestore} from '@angular/fire/firestore';
import {ActivatedRoute} from '@angular/router';
import {Observable} from 'rxjs';
import {map, tap} from 'rxjs/operators';
import {reducer} from '../../utils';
import {GameData, PlayerGameData} from '../game.component';

@Component({
  selector: 'ad-result',
  templateUrl: './result.component.html',
  styleUrls: ['./result.component.scss']
})
export class ResultComponent {

  public readonly players: Observable<Array<PlayerGameData>>;

  constructor(private readonly db: AngularFirestore, private readonly route: ActivatedRoute) {
    this.players = db.collection('games').doc<GameData>(route.snapshot.paramMap.get('id'))
      .collection<PlayerGameData>('players').valueChanges({idField: 'id'}).pipe(
        tap(x => console.log(x)),
        map(value => value.sort(
          (a: PlayerGameData, b: PlayerGameData) => a.throws.reduce(reducer, 0) - b.throws.reduce(reducer, 0)
        ))
      );
  }


}
