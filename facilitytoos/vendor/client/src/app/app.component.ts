import { Component, OnInit } from "@angular/core";
import { MsalService, BroadcastService } from "@azure/msal-angular";
import { AuthService } from "./auth-service/auth.service";
import { Router } from '@angular/router';

@Component({
  selector: "app-root",
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.css"],
})
export class AppComponent implements OnInit {
  title = "FacilityToolFrontend";
  isIdToken = false;
  GroupNames:any;
  isIframe: boolean = window !== window.parent && !window.opener;
  accessTokenRequest = {
    scopes: ["user.read"],
    redirectUri:"http://localhost:4200/",
 };
 accessToken: string;
  constructor(
    private msalService: MsalService,
    private authService: AuthService,
    private router: Router,
    private broadcastService : BroadcastService
  ) {}
  ngOnInit() {
    this.isLoggedIn();


    this.broadcastService.subscribe('msal:loginSuccess', () => {
      this.isLoggedIn();
    });
    if(this.isLoggedIn){
      this.msalService.acquireTokenSilent(this.accessTokenRequest).then(resToken => {
        this.accessToken =resToken.accessToken
        localStorage.setItem('accessToken', this.accessToken);
       })
      }

    if (!this.isIframe) {
      /**
       * handleRedirectcall back function is msal function wordt gebruik door login function
       * in auth component om te weten waar de user moet redirect moet worden als hij ingelogd is
       */
      this.msalService.handleRedirectCallback((authError, response) => {
        if (authError) {
          console.error("Redirect Error: ", authError.errorMessage);
          return;
        }
      });
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

  disableRouting() {
    return (
      window.location.href.indexOf("id_token") !== -1 ||
      (window !== window.parent && !window.opener)
    );
  }
}
