import { Injectable } from '@angular/core';
import { Router, CanActivate } from '@angular/router';
import { AuthService } from './auth.service';
@Injectable()
export class AuthGuard implements CanActivate {
  routeId;
  constructor(private authService: AuthService, public router: Router) {}

  /**
   * This checks if the user is already logged. If he is not logged in,
   * he is redirected to the login page
   */
  canActivate(): boolean {
    this.isLoggedIn();
    this.routeId = location.pathname;

    if (!this.isLoggedIn()) {
      this.router.navigate(['/login']);
      return false;
    }
    return true;
  }

  /**
   * This checks if the user in logged in or not
   */
  isLoggedIn() {
    return this.authService.Authenticated();
  }
}
