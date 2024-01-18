// auth.service.ts
import { Injectable } from "@angular/core";

@Injectable({
   providedIn: "root",
})
export class AuthService {
   isAuthenticated = false; // You can set this based on your authentication logic

   constructor() {}

   // Example: Check if the user is authenticated
   checkAuthentication(): boolean {
      return this.isAuthenticated;
   }

   setAuthenticated(status: boolean): void {
      this.isAuthenticated = status;
   }

   // Simulate a login method that sets isAuthenticated to true
   login(): void {
      this.isAuthenticated = true;
   }

   // Simulate a logout method that sets isAuthenticated to false
   logout(): void {
      this.isAuthenticated = false;
   }
}
