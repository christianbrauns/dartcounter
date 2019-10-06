import {Component, OnInit} from '@angular/core';
import {AngularFirestore} from '@angular/fire/firestore';
import {ActivatedRoute} from '@angular/router';
import {Observable} from 'rxjs';
import {tap} from 'rxjs/operators';
import {PlayerData} from '../player/player.component';

export interface GameData {
  id: string;
  mode: string;
  type: string;
  players: Array<PlayerData>;
}

@Component({
  selector: 'ad-game',
  templateUrl: './game.component.html',
  styleUrls: ['./game.component.scss']
})
export class GameComponent implements OnInit {
  public currentPlayer: PlayerData;
  public currentPlayerCount: number = 301;
  public currentPlayerRound: Array<number> = [];
  public currentPlayerAverage: number;
  public countDouble: boolean = false;
  public countTriple: boolean = false;
  private game: Observable<GameData>;

  constructor(private readonly db: AngularFirestore, route: ActivatedRoute) {
    this.game = db.collection('games').doc<GameData>(route.snapshot.paramMap.get('id')).valueChanges().pipe(
      tap((source: GameData) => this.currentPlayer = source.players[0])
    );
  }

  public ngOnInit() {
  }

  public hit(value: number) {
    const count: number = this.countTriple ? value * 3 : this.countDouble ? value * 2 : value;
    this.currentPlayerRound.push(count);
    this.countDouble = false;
    this.countTriple = false;
    if (this.currentPlayerRound.length === 2) {
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
    this.currentPlayerRound.pop();
  }

  private nextPlayer() {

  }
}
