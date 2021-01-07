import { Injectable } from '@angular/core';
import { Router, CanActivate } from '@angular/router';
import { AuthService } from './auth.service';
import { MsalService } from '@azure/msal-angular';
@Injectable()
export class MijnTakenGuard implements CanActivate {
  constructor(private authService: AuthService, public router: Router) {
  }
  canActivate(): boolean {

    /**
     * This checks to see who is trying to redirect to 'mijn-taken' since not everyone is allowed
     * to view this page. It is restricted to the logistic coordinator and the logistic employee
     * There is also a restriction to what they can see on this page
     */
    if ( this.authService.isFacilitaireCoordinator &&  this.authService.isFacilitaireMedewerker) {


      // These users can only see their assigned orders
      this.router.navigate(['/']);
      return false;
    } else {
      return true;
    }

  }




}
