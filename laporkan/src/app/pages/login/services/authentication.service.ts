import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { Router } from '@angular/router';
import { Observable, from, of } from 'rxjs';
import { GoogleAuthProvider } from '@firebase/auth';

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {

  constructor(
    private auth: AngularFireAuth,
    private router: Router
  ) { }

  signIn(params: SignIn): Observable<any> {
    return from(this.auth.signInWithEmailAndPassword(
      params.email, params.password
    ));
  }

  signOut(): Observable<any> {
    return from(this.auth.signOut().then( () => {
      this.router.navigate(['login']);
    }));
  }

  googleSignIn() {
    return from(this.auth.signInWithPopup(new GoogleAuthProvider()).then(res => {
      this.router.navigate(['home']);
      localStorage.setItem('user', JSON.stringify(res.user));
    }));
  }

}

type SignIn = {
  email: string;
  password: string;
}
