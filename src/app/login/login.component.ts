import { ChangeDetectionStrategy, Component } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { auth } from 'firebase/app';
import { from, Observable } from 'rxjs';

@Component({
  selector: 'ad-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class LoginComponent {
  constructor(private readonly afAuth: AngularFireAuth) {}

  public signInGH(): Observable<auth.UserCredential> {
    return this.OAuthProvider(new auth.GithubAuthProvider());
  }

  public signInGoogle(): Observable<auth.UserCredential> {
    return this.OAuthProvider(new auth.GoogleAuthProvider());
  }

  private OAuthProvider(provider: auth.AuthProvider): Observable<auth.UserCredential> {
    return from(this.afAuth.auth.signInWithPopup(provider));
  }
}
