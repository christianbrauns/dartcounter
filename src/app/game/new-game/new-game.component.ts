import {Component, OnInit} from '@angular/core';
import {AngularFirestore} from '@angular/fire/firestore';
import {FormArray, FormBuilder, FormGroup, Validators} from '@angular/forms';
import {ActivatedRoute, Router} from '@angular/router';
import {Observable, ReplaySubject} from 'rxjs';
import {PlayerData} from '../../player/player.component';
import {GameData} from '../game.component';

@Component({
  selector: 'ad-new-game',
  templateUrl: './new-game.component.html',
  styleUrls: ['./new-game.component.scss']
})
export class NewGameComponent implements OnInit {
  public readonly gameForm: FormGroup;
  private readonly _players: ReplaySubject<Array<PlayerData>> = new ReplaySubject<Array<PlayerData>>();
  private readonly selectedPlayers: Array<string> = new Array<string>();

  constructor(private readonly db: AngularFirestore, private readonly formBuilder: FormBuilder, private readonly router: Router,
              private readonly route: ActivatedRoute) {
    this.db.collection<PlayerData>('players').valueChanges().subscribe(value => this._players.next(value));

    this.gameForm = formBuilder.group({
      variant: [{value: 'x01', disabled: true}, Validators.required],
      type: [{value: '301', disabled: false}, Validators.required],
      mode: [{value: 's-out', disabled: false}, Validators.required],
      players: formBuilder.array([formBuilder.group({
        name: [],
      })])
    });

  }

  public get playersData(): Observable<Array<PlayerData>> {
    return this._players.asObservable();
  }

  public get playersForm(): FormArray {
    return this.gameForm.controls.players as FormArray;
  }

  public ngOnInit() {
  }

  public addPlayer(value: any) {
    // (this.gameForm.get('players') as FormArray).push(value);
    console.log(this.gameForm.value);
    console.log(this.playersForm.value);
  }

  public lessPlayers() {
    this.playersForm.removeAt(this.playersForm.length - 1);
  }

  public moreplayers() {
    this.playersForm.push(this.formBuilder.group({
      name: [],
    }));
  }

  public startGame() {
    const newGame: GameData = this.gameForm.value as GameData;
    // newGame.players.forEach(value => value.round = []);
    this.db.collection('games').add(newGame)
      .then(value => {
        newGame.players.forEach((value1, index) => this.db.collection('games').doc(value.id).collection('players').doc(index.toString()).set(value1));
        this.router.navigate(['..', value.id], {relativeTo: this.route});
      })
      .catch(reason => console.log(reason));
  }
}
