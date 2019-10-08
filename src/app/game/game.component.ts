import { Component, OnInit } from '@angular/core';
import { AngularFirestore, AngularFirestoreDocument } from '@angular/fire/firestore';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { PlayerData } from '../player/player.component';

export interface GameData {
  id: string;
  mode: string;
  players: Array<PlayerGameData>;
  type: string;
}

export interface PlayerGameData extends PlayerData {
  id: string;
  throws: Array<number>;
}

@Component({
  selector: 'ad-game',
  templateUrl: './game.component.html',
  styleUrls: ['./game.component.scss'],
})
export class GameComponent implements OnInit {
  public countDouble: boolean = false;
  public countTriple: boolean = false;
  public currentPlayer: PlayerGameData;
  public currentPlayerAverage: number;
  public currentPlayerCount: number = 301;
  public currentRound: number;
  public currentThrow: number;
  public readonly game: Observable<GameData>;
  public readonly players: Observable<Array<PlayerGameData>>;
  private readonly firebaseGame: AngularFirestoreDocument<GameData>;

  constructor(private readonly db: AngularFirestore, route: ActivatedRoute) {
    this.firebaseGame = db.collection('games').doc<GameData>(route.snapshot.paramMap.get('id'));
    this.game = this.firebaseGame.valueChanges();
    this.players = this.firebaseGame.collection<PlayerGameData>('players').valueChanges({ idField: 'id' }).pipe(
      tap(x => console.log(x)),
      tap((source: Array<PlayerGameData>) => {
        this.currentPlayer = this.findNextPlayer(source);
        this.currentThrow = this.currentPlayer.throws.length;
        setTimeout(() => {
          this.currentRound = Math.floor(this.currentPlayer.throws.length / 3);
        }, 3000);
      }),
    );
  }

  public double() {
    this.countDouble = !this.countDouble;
    this.countTriple = false;
  }

  public hit(value: number) {
    const count: number = this.countTriple ? value * 3 : this.countDouble ? value * 2 : value;
    this.currentPlayer.throws.push(count);
    this.firebaseGame.collection('players').doc(this.currentPlayer.id).update(this.currentPlayer)
      .catch(reason => console.log(reason))
      .then(value1 => console.log(value1));

    this.countDouble = false;
    this.countTriple = false;
    if (this.currentPlayer.throws.length % 3 === 2) {
      this.nextPlayer();
    }
  }

  public ngOnInit() {
  }

  public triple() {
    this.countTriple = !this.countTriple;
    this.countDouble = false;
  }

  public undo() {
    this.currentPlayer.throws.pop();
    this.firebaseGame.collection('players').doc(this.currentPlayer.id).update(this.currentPlayer)
      .catch(reason => console.log(reason))
      .then(value1 => console.log(value1));
  }

  private findNextPlayer(source: Array<PlayerGameData>): PlayerGameData {
    let players: Array<PlayerGameData> = source.filter(value => value.throws.length % 3 !== 0);
    if (players.length > 0) {
      console.log('123');
      return players[0];
    }

    players = source.filter(value => value.throws.length % 3 === 0);
    console.log('456');

    let num: number;

    for (const player of players) {
      if (num && num > player.throws.length) {
        console.log('found next: ' + player.name);

        return player;
      } else {
        num = player.throws.length;
      }
    }
    // players.forEach(value => {
    //   if (num && num > value.throws.length) {
    //     console.log('found next: ' + value.name);
    //     return value;
    //   } else {
    //     num = value.throws.length;
    //   }
    // });

    console.log('end');

    return players[0];
    // const len: Array<number> = players.map(value => value.throws.length);
    // const smalest: number = Math.min(...len);
    //
    // players.find(value => value.throws.length);
    // players.return;
    // players[0];
  }

  private nextPlayer() {

  }
}
