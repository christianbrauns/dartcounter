import { ChangeDetectionStrategy, Component } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { firestore } from 'firebase/app';
import { map, take, takeUntil, tap } from 'rxjs/operators';

import { PlayerData } from '../../player/player.component';
import { GameService } from '../../services/game.service';
import { PlayerService } from '../../services/player.service';
import { WithDestroy } from '../../utils/with-destroy';
import { GameData, PlayerGameData } from '../game.component';


@Component({
  selector: 'ad-new-game',
  templateUrl: './new-game.component.html',
  styleUrls: ['./new-game.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class NewGameComponent extends WithDestroy() {
  public readonly gameForm: FormGroup;
  public players: Array<PlayerData>;

  constructor(
    private readonly formBuilder: FormBuilder,
    private readonly router: Router,
    private readonly gameService: GameService,
    private readonly route: ActivatedRoute,
    private readonly playerService: PlayerService
  ) {
    super();
    this.gameForm = formBuilder.group({
      variant: [{ value: 'x01', disabled: true }, Validators.required],
      type: [{ value: '301', disabled: false }, Validators.required],
      mode: [{ value: 's-out', disabled: true }, Validators.required],
      playersCount: [{ value: 2, disabled: false }, Validators.required],
      players: formBuilder.array([
        formBuilder.group({
          playerId: []
        }),
        formBuilder.group({
          playerId: []
        })
      ])
    });

    playerService.players.pipe(
      takeUntil(this.destroy$),
      map((value) => value.sort((a, b) => a.name.localeCompare(b.name))),
      tap((value) => (this.players = value)),
      tap((value) => {
        // FixMe these values will set again when a new user is created while this form is visible
        ((this.gameForm.controls.players as FormArray).controls[0] as FormGroup).controls.playerId.setValue(value[0].id);
        ((this.gameForm.controls.players as FormArray).controls[1] as FormGroup).controls.playerId.setValue(value[1].id);
      })
    ).subscribe();

    this.gameForm.controls.playersCount.valueChanges.pipe(
      takeUntil(this.destroy$),
      tap((x) => {
        let diff: number = x - this.playersForm.length;
        if (diff > 0) {
          for (let i: number = 0; i < diff; i++) {
            this.createMorePlayers();
          }
        } else {
          for (const i: number = 0; diff < i; diff++) {
            this.playersForm.removeAt(this.playersForm.length - 1);
          }
        }
      })
    ).subscribe();
  }

  public get playersForm(): FormArray {
    return this.gameForm.controls.players as FormArray;
  }

  public get playersFormControls(): Array<FormGroup> {
    return this.playersForm.controls as Array<FormGroup>;
  }

  public lessPlayers(): void {
    this.playersForm.removeAt(this.playersForm.length - 1);
    this.gameForm.controls.playersCount.setValue(this.playersForm.length);
  }

  public morePlayers(): void {
    this.createMorePlayers();
    this.gameForm.controls.playersCount.setValue(this.playersForm.length);
  }

  public startGame(): void {
    let players: Array<PlayerGameData> = Array.from<{ playerId: string }>(this.playersForm.value).map((value) => {
      return { playerRef: this.playerService.getPlayerRef(value.playerId), throws: [] } as PlayerGameData;
    });

    players = this.shufflePlayers(players);

    const newGame: GameData = {
      type: this.gameForm.controls.type.value,
      mode: this.gameForm.controls.mode.value,
      date: firestore.Timestamp.now(),
      players
    };

    this.gameService.addGame(newGame).pipe(
      take(1),
      tap((x) => this.router.navigate(['..', x.id], { relativeTo: this.route }))
    ).subscribe();
  }

  private createMorePlayers(): void {
    if (this.players.length >= this.playersForm.length + 1) {
      this.playersForm.push(
        this.formBuilder.group({
          playerId: [this.players[this.playersForm.length].id]
        })
      );
    }
  }

  private shufflePlayers<T>(array: Array<T>): Array<T> {
    let currentIndex: number = array.length;
    let temporaryValue: T;
    let randomIndex: number;

    // While there remain elements to shuffle...
    while (0 !== currentIndex) {
      // Pick a remaining element...
      randomIndex = Math.floor(Math.random() * currentIndex);
      currentIndex -= 1;

      // And swap it with the current element.
      temporaryValue = array[currentIndex];
      array[currentIndex] = array[randomIndex];
      array[randomIndex] = temporaryValue;
    }

    return array;
  }
}
