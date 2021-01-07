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
     * dit controleert wie heeft toegang naar mijn meldingen pagina
     */
      let groupNames = localStorage.getItem('GroupNames');
      let groupNamesArray = groupNames.split(',');
    if (groupNamesArray.includes("Opleidingshoofd group")) {

      return true;
      //bij mijn taken pagina kan hij alleen toegewijzen aan mij zien.
    }else if (groupNamesArray.includes("Medewerker group")) {
      return true;
    }else if (groupNamesArray.includes("Admins group")) {
      return true;
    }
    this.router.navigate(['/'])
    return false;
  }




}
