import { Component } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { AuthenticationService } from '../../pages/login/services/authentication.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent {

  constructor(
    private auth : AuthenticationService,
    private firestore: AngularFirestore
    ) { }

  documents: any;

  ngOnInit(): void {
    
    const report = 'reports';

    this.firestore
      .collection(report)
      .get()
      .subscribe((querySnapshot) => {
        this.documents = querySnapshot.docs.map((doc) => doc.data());
      });
  }

  signOut() {
    this.auth.signOut();
  }

}
