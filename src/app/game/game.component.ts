import {Component, OnInit, ViewChild} from '@angular/core';
import {AngularFirestore, AngularFirestoreDocument} from '@angular/fire/firestore';
import {MatProgressBar, MatSnackBar} from '@angular/material';
import {ActivatedRoute, Router} from '@angular/router';
import {Observable} from 'rxjs';
import {tap} from 'rxjs/operators';
import {PlayerData} from '../player/player.component';

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
  @ViewChild(MatProgressBar, {static: false}) public matProgressBar: MatProgressBar;
  public progressValue: number = 0;
  public countDouble: boolean = false;
  public countTriple: boolean = false;
  public currentPlayer: PlayerGameData;
  public gameCount: number = 301;
  public currentRound: number;
  public currentThrow: number;
  public readonly game: Observable<GameData>;
  public readonly players: Observable<Array<PlayerGameData>>;
  public currentPlayerCount: number;
  private readonly firebaseGame: AngularFirestoreDocument<GameData>;

  constructor(private readonly db: AngularFirestore, private readonly route: ActivatedRoute, private snackBar: MatSnackBar,
              private readonly router: Router) {
    this.firebaseGame = db.collection('games').doc<GameData>(route.snapshot.paramMap.get('id'));
    this.firebaseGame.valueChanges().pipe(
      tap(x => this.gameCount = this.getGameCount(x.type))
    ).subscribe();

    this.players = this.firebaseGame.collection<PlayerGameData>('players').valueChanges({idField: 'id'}).pipe(
      tap(x => console.log(x)),
      tap((source: Array<PlayerGameData>) => {
        this.currentPlayer = this.findNextPlayer(source);
        this.currentThrow = this.currentPlayer.throws.length;
        this.currentPlayerCount = this.currentPlayer.throws.reduce(this.reducer);

        if (!this.currentRound) {
          this.currentRound = Math.floor(this.currentPlayer.throws.length / 3);
        } else if (this.currentRound !== Math.floor(this.currentPlayer.throws.length / 3)) {
          this.progressValue = 1;
          setTimeout(() => {
            this.currentRound = Math.floor(this.currentPlayer.throws.length / 3);
            this.progressValue = 0;
          }, 3000);
        }
      }),
    );
  }

  public reducer = (accumulator, currentValue) => accumulator + currentValue;

  public double() {
    this.countDouble = !this.countDouble;
    this.countTriple = false;
  }

  public hit(value: number) {
    const count: number = this.countTriple ? value * 3 : this.countDouble ? value * 2 : value;

    if (this.currentPlayerCount + count > this.gameCount) {
      this.snackBar.open('Punktzahl Überschritten', '', {
        duration: 3000,
      });

      this.currentPlayer.throws.push(null);

      while (this.currentPlayer.throws.length % 3 !== 0) {
        this.currentPlayer.throws.push(null);
      }
    } else {
      this.currentPlayer.throws.push(count);
    }

    this.firebaseGame.collection('players').doc(this.currentPlayer.id).update(this.currentPlayer)
      .catch(reason => console.log(reason))
      .then(value1 => console.log(value1));

    this.countDouble = false;
    this.countTriple = false;

    if (this.currentPlayerCount + count === this.gameCount) {
      this.router.navigate(['result'], {relativeTo: this.route});
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

  public getTrows(player: PlayerGameData): number {
    return player.throws.filter(x => x !== null).length;
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

    return players[0];
  }

  private getGameCount(type: string): number {
    switch (type) {
      case '301':
        return 301;
      case '401':
        return 401;
      case '501':
        return 501;
      case '601':
        return 601;
      case '701':
        return 701;
      case '801':
        return 801;
      case '901':
        return 901;
    }
  }
}
