import { Component } from '@angular/core';
import { AuthenticationService } from '../../pages/login/services/authentication.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent {

  constructor(private auth : AuthenticationService) { }

  ngOnInit(): void {
  }

  signOut() {
    this.auth.signOut();
  }

}
