import { Injectable } from '@angular/core';
import { Router, CanActivate } from '@angular/router';
import { AuthService } from './auth.service';
import { MsalService } from '@azure/msal-angular';
@Injectable()
export class AdminGuard implements CanActivate {
  constructor(private authService: AuthService, public router: Router) {
  }
  canActivate(): boolean {

    /**
     * dit checkt als de user admin role heeft, redirect hem naar de admin page, anders wordt redirect naar home pagina
     */
      let groupNames = localStorage.getItem('GroupNames');
      let arr = groupNames.split(',');
    if (arr.includes("Admins group")) {

      return true;
    }
    this.router.navigate(['/'])
    return false;
  }




}
