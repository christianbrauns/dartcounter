import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { AngularFireModule } from '@angular/fire';
import { AngularFireAuthModule } from '@angular/fire/auth';
import { AngularFirestoreModule } from '@angular/fire/firestore';
import { AngularFireStorageModule } from '@angular/fire/storage';
import { MatButtonModule, MatDialogModule, MatIconModule, MatMenuModule, MatSnackBarModule, MatToolbarModule } from '@angular/material';

import { environment } from '../../environments/environment';
import { LoginComponent } from '../login/login.component';
import { PlayerService } from '../services/player.service';
import { SettingsService } from '../services/settings.service';
import { RootRoutingModule } from './root-routing.module';
import { RootComponent } from './root.component';

@NgModule({
  declarations: [RootComponent, LoginComponent],
  imports: [
    CommonModule,
    AngularFireModule.initializeApp(environment.firebase),
    AngularFirestoreModule,
    AngularFireStorageModule,
    AngularFireAuthModule,
    MatToolbarModule,
    MatMenuModule,
    MatIconModule,
    MatButtonModule,
    MatDialogModule,
    MatSnackBarModule,
    RootRoutingModule
  ],
  providers: [PlayerService, SettingsService]
})
export class RootModule {
}
