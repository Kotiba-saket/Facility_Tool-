import { Injectable } from '@angular/core';
import { Router, CanActivate } from '@angular/router';
import { AuthService } from './auth.service';
@Injectable()
export class ExternalFirmGuard implements CanActivate {
  routeId;
  constructor(private authService: AuthService, public router: Router) {}
  canActivate(): boolean {
    this.isLoggedIn();
    this.routeId = location.pathname;
    /**
     * This method checks if the user in not logged in
     * If not logged in, he is redirected to the login page
     * It also checks if the user trying to log in is an external firm to know
     * which permissions or roles to give him
     */

    if (!this.isLoggedIn() && !this.isExternalFirm()) {
      this.router.navigate(['/login']);
      return false;
    } else if (this.isExternalFirm() && !this.isLoggedIn()) {
      return true;
    }
    return true;
  }

  /**
   * This checks if the user in logged in or not
   */
  isLoggedIn() {
    return this.authService.Authenticated();
  }


  /**
   * This checks if the user is an external firm
   */
  isExternalFirm() {
  return this.authService.checkIfExternalFirm();
}

}
