import { Injectable } from '@angular/core';
import { AngularFirestore, DocumentReference } from '@angular/fire/firestore';
import { from, Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { GameData } from '../game/game.component';

@Injectable()
export class GameService {

  constructor(private readonly db: AngularFirestore) {
  }

  public addGame(game: GameData): Observable<DocumentReference> {
    return from(this.db.collection('games').add(game));
  }

  public getGameById(id: string): Observable<GameData> {
    return from(this.db.collection('games').doc<GameData>(id).get().pipe(
      map(value => value.data() as GameData))
    );
  }

  public getChangesGameById(id: string): Observable<GameData> {
    return this.db.collection('games').doc<GameData>(id).valueChanges();
  }

  public updateGame(id: string, game: any): Observable<unknown> {
    return from(this.db.collection('games').doc<GameData>(id).set(game, { merge: true }));
  }

  public getGames(): Observable<Array<GameData>> {
    return this.db.collection<GameData>('games').valueChanges({ idField: 'id' });
  }
}
