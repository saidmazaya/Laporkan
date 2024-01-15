import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthenticationService } from './services/authentication.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrl: './register.component.css',
})
export class RegisterComponent {
  form!: FormGroup;
  isLoggingIn = false;
  loginError = '';

  constructor(
    private AuthenticationService: AuthenticationService,
    private formBuilder: FormBuilder,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.form = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required]],
      username: ['', [Validators.required]],
      nik: ['', [Validators.required]],
      phone: ['', [Validators.required]],
      address: ['', [Validators.required]]
    });
  }

  register() {
    this.isLoggingIn = true;
    this.loginError = '';

    this.AuthenticationService.register({
      email: this.form.value.email,
      password: this.form.value.password,
      username: this.form.value.username,
      nik: this.form.value.nik,
      phone: this.form.value.phone,
      address: this.form.value.address,
      role: "user"
    }).subscribe(
      () => {
        this.router.navigate(['login']);
      },
      (error: any) => {
        this.isLoggingIn = false;

        // Tangkap pesan error dari Firebase
        if (error.code === 'auth/invalid-email') {
          this.loginError = 'The email is badly formatted.';
        } else if (error.code === 'auth/weak-password') {
          this.loginError = 'Password should be at least 6 characters.';
        } else if (error.code === 'auth/email-already-in-use') {
          this.loginError = 'The email is already in use by another account.';
        } else {
          // Tangkap pesan error lainnya
          this.loginError = 'Login failed. Please try again later.';
        }
      }
    );
  }

  googleLogin() {
    this.AuthenticationService.googleSignIn();
  }
}
