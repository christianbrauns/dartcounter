import {Component, OnInit} from '@angular/core';
import {AngularFirestore} from '@angular/fire/firestore';
import {ActivatedRoute} from '@angular/router';
import {Observable} from 'rxjs';

@Component({
  selector: 'ad-game',
  templateUrl: './game.component.html',
  styleUrls: ['./game.component.scss']
})
export class GameComponent implements OnInit {
  private game: Observable<any>;

  constructor(private readonly db: AngularFirestore, route: ActivatedRoute) {
    this.game = db.collection('games').doc(route.snapshot.paramMap.get('id')).valueChanges();//.pipe(source => console.log(source));
  }

  public ngOnInit() {
  }

}
