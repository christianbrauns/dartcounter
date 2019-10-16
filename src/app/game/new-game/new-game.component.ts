import {Component, OnInit} from '@angular/core';
import {AngularFirestore} from '@angular/fire/firestore';
import {FormArray, FormBuilder, FormGroup, Validators} from '@angular/forms';
import {ActivatedRoute, Router} from '@angular/router';
import {map, tap} from 'rxjs/operators';
import {PlayerData} from '../../player/player.component';
import {GameData} from '../game.component';

@Component({
  selector: 'ad-new-game',
  templateUrl: './new-game.component.html',
  styleUrls: ['./new-game.component.scss'],
})
export class NewGameComponent implements OnInit {
  public readonly gameForm: FormGroup;
  public players: Array<PlayerData>;

  constructor(private readonly db: AngularFirestore, private readonly formBuilder: FormBuilder, private readonly router: Router,
              private readonly route: ActivatedRoute) {
    this.gameForm = formBuilder.group({
      variant: [{value: 'x01', disabled: true}, Validators.required],
      type: [{value: '301', disabled: false}, Validators.required],
      mode: [{value: 's-out', disabled: true}, Validators.required],
      playersCount: [{value: 2, disabled: false}, Validators.required],
      players: formBuilder.array([
        formBuilder.group({
          name: [],
        }), formBuilder.group({
          name: [],
        })]),
    });

    this.db.collection<PlayerData>('players').valueChanges().pipe(
      map(value => value.sort((a, b) => a.name.localeCompare(b.name))),
      tap(value => this.players = value),
      tap(value => {
        // FixMe these values will set again when a new user is created while this form is visible
        ((this.gameForm.controls.players as FormArray).controls[0] as FormGroup).controls.name.setValue(value[0].name);
        ((this.gameForm.controls.players as FormArray).controls[1] as FormGroup).controls.name.setValue(value[1].name);
      }),
    ).subscribe();

    this.gameForm.controls.playersCount.valueChanges.pipe(
      tap(x => {
        let diff: number = x - this.playersForm.length;
        if (diff > 0) {
          for (let i = 0; i < diff; i++) {
            this.createMorePlayers();
          }
        } else {
          for (let i = 0; diff < i; diff++) {
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

  public ngOnInit() {
  }

  public startGame() {
    const newGame: GameData = {
      type: this.gameForm.controls.type.value,
      mode: this.gameForm.controls.mode.value,
      date: new Date(),
      players: this.playersForm.value
    } as GameData;

    newGame.players.forEach(value => value.throws = []);

    this.db.collection('games').add(newGame)
      .then(value => {
        // newGame.players.forEach(
        //   (value1, index) =>
        //     this.db.collection('games').doc(value.id).collection('players').doc(index.toString()).set(value1),
        // );
        this.router.navigate(['..', value.id], {relativeTo: this.route});
      })
      .catch(reason => console.log(reason));
  }

  private createMorePlayers(): void {
    if (this.players.length >= this.playersForm.length + 1) {
      this.playersForm.push(this.formBuilder.group({
        name: [this.players[this.playersForm.length].name],
      }));
    }
  }
}
