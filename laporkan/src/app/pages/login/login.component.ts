import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthenticationService } from './services/authentication.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {

  form!: FormGroup;
  isLoggingIn = false;
  loginError:string = '';

  constructor(
    private AuthenticationService: AuthenticationService,
    private formBuilder: FormBuilder,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.form = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required]]
    });
  }

  login() {
    this.isLoggingIn = true;
    this.loginError = '';

    this.AuthenticationService.signIn({
      email: this.form.value.email,
      password: this.form.value.password
    }).subscribe(() => {
      this.router.navigate(['home']);
    }, (error: any) => {
      this.isLoggingIn = false;

       // Tangkap pesan error dari Firebase
      if (error.code === 'auth/invalid-credential') {
        this.loginError = 'User not found. Please check your email or sign up.';
      } else {
        // Tangkap pesan error lainnya
        this.loginError = 'Login failed. Please try again later.';
      }
    })
  }
}
