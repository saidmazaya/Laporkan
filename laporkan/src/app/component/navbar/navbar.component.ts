import { Component } from '@angular/core';
import { AuthenticationService } from '../../pages/login/services/authentication.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css'
})
export class NavbarComponent {
  constructor(private auth : AuthenticationService) { }

  ngOnInit(): void {
  }

  signOut() {
    this.auth.signOut();
  }
}
