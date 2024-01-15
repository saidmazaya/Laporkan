import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { Router } from '@angular/router';
import { Observable, from } from 'rxjs';
import { GoogleAuthProvider } from '@firebase/auth';
import { AngularFirestore } from '@angular/fire/compat/firestore';

@Injectable({
  providedIn: 'root',
})
export class AuthenticationService {
  constructor(private fireauth: AngularFireAuth, private router: Router, private firestore: AngularFirestore) {}

  // register method
  register(params: Register): Observable<any> {
    return from(
      this.fireauth.createUserWithEmailAndPassword(
        params.email,
        params.password
      ).then(cred=> {
        if (cred.user !== null) {
          return this.firestore.collection('users').doc(cred.user.uid)
          .set({username: params.username, email: params.email, role: params.role });
        }
        throw new Error('User is null');
      })
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
  username: string;
  role: string;
};
