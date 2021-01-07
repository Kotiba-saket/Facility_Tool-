import { Component, OnInit, Injector, HostListener } from '@angular/core';
import { BroadcastService, MsalService } from '@azure/msal-angular';
import { Logger, CryptoUtils } from 'msal';
import { AuthService } from '../auth-service/auth.service';
import { Router } from '@angular/router';



@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.css']
})
export class AuthComponent implements OnInit {
  isIframe = false;
  loggedIn = false;
  returnValue: boolean;
  GroupNames:any;
newInnerHeight;
newInnerWidth  ;
@HostListener('window:resize', ['$event'])
onResize(event) {
  this.newInnerHeight = event.target.innerHeight;
  this.newInnerWidth = event.target.innerWidth;
  console.log(this.newInnerWidth);
}
  constructor(private msalService: MsalService, private router: Router, private authService: AuthService) {}

  ngOnInit() {
       this.isLoggedIn();
     /**
      * als de user ingelogd is en navigate naar de login page, wordt redirect naar home page
      */
        if(this.isLoggedIn()){

          this.router.navigate(['/']);
        }

  }
  /**
   * het checkt als de gebruiker ingelogd is of niet
   * @returns true als de gebruiker ingelogd is en false als niet
   *
   */
  isLoggedIn() {
    return this.authService.Authenticated();
  }

/**
 * het redirect user naar microsofy login pagina, en login popup login wordt getoond als de gebruiker internet explorer gebruikt
 */
  login() {
    const isIE = window.navigator.userAgent.indexOf('MSIE ') > -1 || window.navigator.userAgent.indexOf('Trident/') > -1;
    if (isIE) {
      this.msalService.loginPopup();
    } else {
      this.msalService.loginRedirect();
    }
  }

}
