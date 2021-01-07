import { Injectable } from '@angular/core';
import { Router, CanActivate } from '@angular/router';
import { AuthService } from './auth.service';
import { MsalService } from '@azure/msal-angular';
@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private authService: AuthService, public router: Router) {}
  canActivate(): boolean {
    this.isLoggedIn();

    /**
     * dit checkt als de user niet ingelogd is, dan navidate hij altijd naar login pagina
     */

    if (!this.isLoggedIn()) {
      this.router.navigate(['/login'])
      return false;
    }
    return true;
  }

  isLoggedIn() {
    return this.authService.Authenticated();
  }


}
