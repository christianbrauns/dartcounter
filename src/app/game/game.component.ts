import { ChangeDetectionStrategy, Component, HostListener } from '@angular/core';
import { AngularFirestore, DocumentReference } from '@angular/fire/firestore';
import { MatSnackBar, ThemePalette } from '@angular/material';
import { ActivatedRoute, Router } from '@angular/router';
import { firestore } from 'firebase/app';
import { interval, Observable } from 'rxjs';
import { delayWhen, finalize, map, take, tap } from 'rxjs/operators';

import { getGameCount } from '../gamerules';
import { PlayerData } from '../player/player.component';
import { GameService } from '../services/game.service';
import { PlayerService } from '../services/player.service';
import { getPlayerCount, typeColor } from '../utils/utils';

export interface GameData {
  date: firestore.Timestamp;
  id?: string;
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
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class GameComponent {
  public countDouble: boolean = false;
  public countTriple: boolean = false;
  public currentPlayer: PlayerGameData;
  public currentPlayerCount: number = 0;
  public currentRound: number;
  public currentThrow: number;
  public gameDestinationCount: number;
  public readonly waitingPlayers: Observable<Array<PlayerGameData>>;
  private currentPlayerIndex: number;
  private game: GameData;
  private inDelay: boolean = false;
  private readonly gameId: string;

  // private ranking: Array<string> = new Array<string>();

  constructor(private readonly db: AngularFirestore, private readonly route: ActivatedRoute, private readonly snackBar: MatSnackBar,
              private readonly router: Router, private readonly playerService: PlayerService, private readonly gameService: GameService) {
    this.gameId = route.snapshot.paramMap.get('id');

    this.waitingPlayers = gameService.getChangesGameById(this.gameId).pipe(
      tap(x => (this.game = x)),
      tap(x => (this.gameDestinationCount = getGameCount(x.type))),
      map(value => value.players),
      tap(x => (this.inDelay = this.needDelay(x))),
      delayWhen(x => (this.needDelay(x) ? interval(2000) : interval(0))),
      tap(players => {
        this.inDelay = false;

        this.currentPlayerIndex = this.findNextPlayerIndex(players);
        this.currentPlayer = players[this.currentPlayerIndex];
        this.currentThrow = this.currentPlayer.throws.length;
        this.currentPlayerCount = this.getPlayerCount(this.currentPlayer);

        this.currentRound = Math.floor(this.currentPlayer.throws.length / 3);
      }),
      // order players by most points
      // FIXME this is reordering the array inside this.game
      // tap(players => {
      //   this.ranking = players.sort(
      //     (a: PlayerGameData, b: PlayerGameData) =>
      //       getPlayerCount(b) - getPlayerCount(a)
      //   ).map(value => value.playerRef.id);
      // }),
      // provide a sorted array to show next player on top
      map(value => value.slice(this.currentPlayerIndex + 1, value.length).concat(value.slice(0, this.currentPlayerIndex))
      )
    );
  }

  @HostListener('window:popstate', ['$event'])
  public onPopState(event: PopStateEvent): void {
    // FIXME check if game is finished and ask to delete
    // console.log(event);
    // console.log('Back button pressed');
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
    return getPlayerCount(player);
  }

  public getPlayerAverage(player: PlayerGameData): number {
    const throwCount: number = this.getTrows(player);
    if (throwCount && player) {
      return (this.getPlayerCount(player) / throwCount) * 3;
    }

    return 0;
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
      this.snackBar.open('Punktzahl überschritten', '', {
        duration: 3000
      });

      while (this.currentPlayer.throws.length % 3 !== 0) {
        this.currentPlayer.throws.pop();
      }

      this.currentPlayer.throws.push(null);

      while (this.currentPlayer.throws.length % 3 !== 0) {
        this.currentPlayer.throws.push(null);
      }
    } else {
      const countStr: number | string = this.countTriple ? `T${ value }` : this.countDouble ? `D${ value }` : value;

      this.currentPlayer.throws.push(countStr);
    }

    this.currentPlayerCount += count;


    this.gameService.updateGame(this.gameId, this.game).pipe(
      take(1),
      finalize(() => {
        if (this.currentPlayerCount === this.gameDestinationCount) {
          this.router.navigate(['result'], { relativeTo: this.route });
        }
      })
    ).subscribe();

    this.countDouble = false;
    this.countTriple = false;
  }

  public triple(): void {
    this.countTriple = !this.countTriple;
    this.countDouble = false;
  }

  public typeColor(color: string): ThemePalette {
    return typeColor(color);
  }

  public undo(): void {
    if (this.currentPlayer.throws.length % 3 === 0 && !this.inDelay) {
      if (this.currentPlayerIndex === 0) {
        this.game.players[this.game.players.length - 1].throws.pop();
      } else {
        this.game.players[this.currentPlayerIndex - 1].throws.pop();
      }
    } else {
      this.currentPlayer.throws.pop();
    }

    this.gameService.updateGame(this.gameId, this.game);
  }

  // public playerRank(player: PlayerGameData): number {
  //   return this.ranking.findIndex(value => value === player.playerRef.id) + 1;
  // }

  private findNextPlayerIndex(source: Array<PlayerGameData>): number {
    const playerIndex: number = source.findIndex(
      value => value.throws.length % 3 !== 0
    );
    if (playerIndex >= 0) {
      return playerIndex;
    }

    let num: number;

    // tslint:disable-next-line:no-shadowed-variable
    for (const { player, index } of source.map((player, index) => ({
      player,
      index
    }))) {
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

    return (
      this.currentPlayerIndex !== undefined &&
      (nextPlayerIndex === this.currentPlayerIndex + 1 ||
        (nextPlayerIndex === 0 &&
          this.currentPlayerIndex === players.length - 1))
    );
  }
}
