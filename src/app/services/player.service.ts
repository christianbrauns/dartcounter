import { Injectable } from '@angular/core';
import { AngularFirestore, DocumentReference } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { map, shareReplay, takeUntil } from 'rxjs/operators';
import { PlayerData } from '../player/player.component';
import { WithDestroy } from '../utils/with-destroy';

@Injectable({
  providedIn: 'root',
})
export class PlayerService extends WithDestroy() {

  public readonly players: Observable<Array<PlayerData>>;

  constructor(private readonly db: AngularFirestore) {
    super();
    this.players = this.db.collection<PlayerData>('players').valueChanges({ idField: 'id' }).pipe(
      takeUntil(this.destroy$),
      map(value => value.sort((a, b) => a.name.localeCompare(b.name))),
      shareReplay(1),
    );
  }

  public addPlayer(player: PlayerData): void {
    this.db.collection('players').add(player).then(r => console.log(r));
  }

  public getPlayer(id: string): Observable<PlayerData> {
    return this.players.pipe(map((x: Array<PlayerData>) => x.find(p => p.id === id)));
  }

  public getPlayerRef(id: string): DocumentReference {
    return this.db.collection<PlayerData>('players').doc(id).ref;
  }

  public setPlayer(id: string, player: PlayerData): void {
    this.db.collection('players').doc(id).set(player).then(r => console.log(r));
  }

  public updatePlayer(id: string, player: PlayerData): void {
    this.db.collection('players').doc(id).update(player).then(r => console.log(r));
  }
}
