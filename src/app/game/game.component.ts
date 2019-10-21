import { Component, ViewChild } from '@angular/core';
import { AngularFirestore, AngularFirestoreDocument, DocumentReference } from '@angular/fire/firestore';
import { MatProgressBar, MatSnackBar, ThemePalette } from '@angular/material';
import { ActivatedRoute, Router } from '@angular/router';
import { firestore } from 'firebase/app';
import { interval, Observable } from 'rxjs';
import { delayWhen, map, tap } from 'rxjs/operators';
import { getGameCount } from '../gamerules';
import { PlayerData } from '../player/player.component';
import { PlayerService } from '../services/player.service';
import { reducer, typeColor } from '../utils/utils';

export interface GameData {
  date: firestore.Timestamp;
  id: string;
  mode: string;
  players: Array<PlayerGameData>;
  type: string;
}

export interface PlayerGameData {
  playerRef: DocumentReference;
  throws?: Array<number | string>;
}

@Component({
  selector: 'ad-game',
  templateUrl: './game.component.html',
  styleUrls: ['./game.component.scss'],
})
export class GameComponent {

  public get currentPlayer(): PlayerGameData | undefined {
    if (this.game) {
      return this.game.players[this.currentPlayerIndex];
    } else {
      return undefined;
    }
  }

  public countDouble: boolean = false;
  public countTriple: boolean = false;
  public currentPlayerCount: number;
  public currentRound: number;
  public currentThrow: number;
  public gameDestinationCount: number;
  @ViewChild(MatProgressBar, { static: false }) public matProgressBar: MatProgressBar;
  public readonly players: Observable<Array<PlayerGameData>>;
  public progressValue: number = 0;
  private currentPlayerIndex: number;
  private readonly firebaseGame: AngularFirestoreDocument<GameData>;
  private game: GameData;
  private inDelay: boolean = false;

  constructor(private readonly db: AngularFirestore, private readonly route: ActivatedRoute, private readonly snackBar: MatSnackBar,
              private readonly router: Router, private readonly playerService: PlayerService) {
    this.firebaseGame = db.collection('games').doc<GameData>(route.snapshot.paramMap.get('id'));

    this.players = this.firebaseGame.valueChanges().pipe(
      tap(x => this.game = x),
      tap(x => this.gameDestinationCount = getGameCount(x.type)),
      map(value => value.players),
      tap(x => this.inDelay = this.needDelay(x)),
      delayWhen(x => this.needDelay(x) ? interval(2000) : interval(0)),
      tap(players => {
        this.inDelay = false;

        this.currentPlayerIndex = this.findNextPlayerIndex(players);
        this.currentThrow = this.currentPlayer.throws.length;
        this.currentPlayerCount = this.getPlayerCount(this.currentPlayer);

        this.currentRound = Math.floor(this.currentPlayer.throws.length / 3);
      }),
      // provide a sorted array to show next player on top
      map(value => value.slice(this.currentPlayerIndex + 1, value.length).concat(value.slice(0, this.currentPlayerIndex))),
    );
  }

  public double(): void {
    this.countDouble = !this.countDouble;
    this.countTriple = false;
  }

  public getPlayerByRef(playerRef: DocumentReference): Observable<PlayerData> | undefined {
    if (playerRef) {
      return this.playerService.getPlayer(playerRef.id);
    } else {
      return undefined;
    }
  }

  public getPlayerCount(player: PlayerGameData): number {
    return Number(player.throws.reduce(reducer, 0));
  }

  public getTrows(player: PlayerGameData): number {
    return player.throws.filter(x => x !== null).length;
  }

  public hit(value: number): void {
    if (this.inDelay) {
      return;
    }

    const count: number = this.countTriple ? value * 3 : this.countDouble ? value * 2 : value;

    if (this.currentPlayerCount + count > this.gameDestinationCount) {
      this.snackBar.open('Punktzahl Überschritten', '', {
        duration: 3000,
      });

      while (this.currentPlayer.throws.length % 3 !== 0) {
        this.currentPlayer.throws.pop();
      }

      this.currentPlayer.throws.push(null);

      while (this.currentPlayer.throws.length % 3 !== 0) {
        this.currentPlayer.throws.push(null);
      }
    } else {
      const countStr: number | string = this.countTriple ? `T${value}` : this.countDouble ? `D${value}` : value;

      this.currentPlayer.throws.push(countStr);
    }

    this.firebaseGame.update(this.game)
      .catch(reason => console.log(reason));

    this.currentPlayerCount += count;

    this.countDouble = false;
    this.countTriple = false;

    if (this.currentPlayerCount === this.gameDestinationCount) {
      this.router.navigate(['result'], { relativeTo: this.route });
    }
  }

  public triple() {
    this.countTriple = !this.countTriple;
    this.countDouble = false;
  }

  public typeColor(color: string): ThemePalette {
    return typeColor(color);
  }

  public undo(): void {
    if (this.currentPlayer.throws.length % 3 === 0 && !this.inDelay) {
      if (this.currentPlayerIndex === 0) {
        this.game.players [this.game.players.length - 1].throws.pop();
      } else {
        this.game.players [this.currentPlayerIndex - 1].throws.pop();
      }
    } else {
      this.currentPlayer.throws.pop();
    }
    this.firebaseGame.update(this.game)
      .catch(reason => console.log(reason))
      .then(value1 => console.log(value1));

  }

  private findNextPlayerIndex(source: Array<PlayerGameData>): number {
    let playerIndex: number = source.findIndex(value => value.throws.length % 3 !== 0);
    if (playerIndex >= 0) {
      return playerIndex;
    }

    let num: number;

    for (const { player, index } of source.map((player, index) => ({ player, index }))) {
      if (num && num > player.throws.length) {

        return index;
      } else {
        num = player.throws.length;
      }
    }

    return 0;
  }

  private needDelay(players: Array<PlayerGameData>): boolean {
    const nextPlayerIndex: number = this.findNextPlayerIndex(players);

    return this.currentPlayerIndex !== undefined &&
      (nextPlayerIndex === this.currentPlayerIndex + 1 ||
        (nextPlayerIndex === 0 && this.currentPlayerIndex === players.length - 1));

    // if (this.currentPlayerIndex !== undefined) {
    //   if (nextPlayerIndex === this.currentPlayerIndex + 1) {
    //     console.log('wertwertasddfsdfsaddffdg');
    //     return true;
    //   } else if (nextPlayerIndex === 0 && this.currentPlayerIndex === players.length - 1) {
    //     console.log('wertwertasd');
    //     return true;
    //   }
    //
    //   console.log('asd');
    // }
    //
    // return false;
  }
}
