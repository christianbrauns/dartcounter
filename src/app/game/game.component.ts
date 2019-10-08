import {Component, OnInit} from '@angular/core';
import {AngularFirestore, AngularFirestoreDocument} from '@angular/fire/firestore';
import {ActivatedRoute} from '@angular/router';
import {Observable} from 'rxjs';
import {filter, tap} from 'rxjs/operators';
import {PlayerData} from '../player/player.component';

export interface GameData {
  id: string;
  mode: string;
  type: string;
  players: Array<PlayerGameData>;
}

export interface PlayerGameData extends PlayerData {
  id: string;
  round: Array<number>;
}

@Component({
  selector: 'ad-game',
  templateUrl: './game.component.html',
  styleUrls: ['./game.component.scss']
})
export class GameComponent implements OnInit {
  public currentPlayer: PlayerGameData;
  public currentPlayerCount: number = 301;
  // public currentPlayerRound: Array<number> = [];
  public currentPlayerAverage: number;
  public countDouble: boolean = false;
  public countTriple: boolean = false;
  public readonly game: Observable<GameData>;
  public readonly players: Observable<Array<PlayerGameData>>;
  private readonly firebaseGame: AngularFirestoreDocument<GameData>;

  constructor(private readonly db: AngularFirestore, route: ActivatedRoute) {
    this.firebaseGame = db.collection('games').doc<GameData>(route.snapshot.paramMap.get('id'));
    this.game = this.firebaseGame.valueChanges();
    this.players = this.firebaseGame.collection<PlayerGameData>('players').valueChanges();
    // this.players = this.firebaseGame.collection('players').valueChanges({idField: 'id'});

    const allTrue = this.game.pipe(
      // map(value => value.players),
      filter(value => value.players.length % 3 !== 0),
      tap(x => console.log(x)),
      tap((source: GameData) => this.currentPlayer = source.players[0])
    ).subscribe();

    const allFalse = this.game.pipe(
      // map(value => value.players),
      filter(value => value.players.length % 3 === 0),
      tap(x => console.log(x)),
      tap((source: GameData) => this.currentPlayer = source.players[0])
    ).subscribe();
  }

  public ngOnInit() {
  }

  public hit(value: number) {
    const count: number = this.countTriple ? value * 3 : this.countDouble ? value * 2 : value;
    this.currentPlayer.round.push(count);
    this.firebaseGame.collection('players').doc('0').update(this.currentPlayer)
      .catch(reason => console.log(reason))
      .then(value1 => console.log(value1));

    // this.currentPlayerRound.push(count);
    this.countDouble = false;
    this.countTriple = false;
    if (this.currentPlayer.round.length % 3 === 2) {
      this.nextPlayer();
    }
  }

  public double() {
    this.countDouble = !this.countDouble;
    this.countTriple = false;
  }

  public triple() {
    this.countTriple = !this.countTriple;
    this.countDouble = false;
  }

  public undo() {
    this.currentPlayer.round.pop();
  }

  private nextPlayer() {

  }
}
