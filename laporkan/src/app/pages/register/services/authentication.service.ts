import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { Router } from '@angular/router';
import { Observable, from } from 'rxjs';
import { GoogleAuthProvider } from '@firebase/auth';

@Injectable({
  providedIn: 'root',
})
export class AuthenticationService {
  constructor(private fireauth: AngularFireAuth, private router: Router) {}

  // register method
  register(params: Register): Observable<any> {
    return from(
      this.fireauth.createUserWithEmailAndPassword(
        params.email,
        params.password
      )
    );
  }

  // google
  googleSignIn() {
    return from(
      this.fireauth.signInWithPopup(new GoogleAuthProvider()).then((res) => {
        this.router.navigate(['home']);
        localStorage.setItem('user', JSON.stringify(res.user));
      })
    );
  }
}

type Register = {
  email: string;
  password: string;
};
