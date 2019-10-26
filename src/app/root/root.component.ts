import { Component } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { MatDialog, MatDialogRef } from '@angular/material';
import { User } from 'firebase';
import { Observable } from 'rxjs';

import { LoginComponent } from '../login/login.component';
import { PlayerData } from '../player/player.component';
import { CheckForUpdateService } from '../services/check-for-update.service';
import { PlayerService } from '../services/player.service';
import { PromptUpdateService } from '../services/prompt-update.service';

@Component({
  selector: 'ad-root',
  templateUrl: './root.component.html',
  styleUrls: ['./root.component.scss'],
  providers: [PromptUpdateService, CheckForUpdateService],
})
export class RootComponent {

  public hasUpdate: Observable<boolean>;
  public title: string = 'Aurora Dart';
  public user: Observable<User>;

  private dialogRef: MatDialogRef<LoginComponent>;

  constructor(private readonly promptUpdateService: PromptUpdateService, private readonly checkForUpdateService: CheckForUpdateService,
              private readonly dialog: MatDialog, private readonly afAuth: AngularFireAuth, playerService: PlayerService) {
    this.hasUpdate = promptUpdateService.hasUpdate;
    this.afAuth.authState.subscribe(value => {
      if (value && this.dialogRef) {
        this.dialogRef.close();
        const player: PlayerData = {
          name: value.displayName ? value.displayName : value.email,
          photoURL: value.photoURL,
        } as PlayerData;

        playerService.setPlayer(value.uid, player);
      }
    });

    this.user = this.afAuth.user;
  }

  public doUpdate(): void {
    this.promptUpdateService.doUpdate();
  }

  public goToIssues(): void {
    window.open('https://github.com/christianbrauns/dartcounter/issues', '_blank');
  }

  public login(): void {
    this.dialogRef = this.dialog.open(LoginComponent);
  }

  public logout(): void {
    this.afAuth.auth.signOut();
  }

}