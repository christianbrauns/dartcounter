import {Component, OnInit} from '@angular/core';
import {AngularFirestore} from '@angular/fire/firestore';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {Observable, ReplaySubject} from 'rxjs';
import {PlayerData} from '../../player/player.component';
import {ActivatedRoute, Router} from '@angular/router';

@Component({
  selector: 'ad-new-game',
  templateUrl: './new-game.component.html',
  styleUrls: ['./new-game.component.scss']
})
export class NewGameComponent implements OnInit {
  public readonly gameForm: FormGroup;
  public countPlayer = 2;
  private readonly _players: ReplaySubject<Array<PlayerData>> = new ReplaySubject<Array<PlayerData>>();
  private readonly selectedPlayers: Array<string> = new Array<string>();

  constructor(private readonly db: AngularFirestore, formBuilder: FormBuilder, private readonly router: Router,
              private readonly route: ActivatedRoute) {
    this.db.collection<PlayerData>('players').valueChanges().subscribe(value => this._players.next(value));

    this.gameForm = formBuilder.group({
      variant: [{value: 'x01', disabled: true}, Validators.required],
      type: [{value: '301', disabled: false}, Validators.required],
      mode: [{value: 's-out', disabled: false}, Validators.required],
      players: []
    });

  }

  public get players(): Observable<Array<PlayerData>> {
    return this._players.asObservable();
  }

  public ngOnInit() {
  }

  public addPlayer(value: any) {
    this.selectedPlayers.push(value);
  }

  public lessPlayers() {
    this.countPlayer--;
  }

  public moreplayers() {
    this.countPlayer++;
  }

  public startGame() {
    this.db.collection('games').add(this.gameForm.value)
      .then(value => this.router.navigate([value.id], {relativeTo: this.route}))
      .catch(reason => console.log(reason));
  }
}
