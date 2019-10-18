import {Component} from '@angular/core';
import {AngularFireAuth} from '@angular/fire/auth';
import {auth} from 'firebase';

@Component({
  selector: 'ad-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {

  constructor(private readonly afAuth: AngularFireAuth) {
  }

  public signInGH(): Promise<void> {
    return this.OAuthProvider(new auth.GithubAuthProvider())
      .then(() => {
        console.log('Successfully logged in!');
      }).catch(error => {
        console.log(error);
      });
  }

  public signInGoogle(): Promise<void> {
    return this.OAuthProvider(new auth.GoogleAuthProvider())
      .then(() => {
        console.log('Successfully logged in!');
      }).catch(error => {
        console.log(error);
      });
  }

  private OAuthProvider(provider: auth.AuthProvider): Promise<void> {
    return this.afAuth.auth.signInWithPopup(provider)
      .then(() => {
      }).catch((error) => {
        console.log(error);
      });
  }

}
