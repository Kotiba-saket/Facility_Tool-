import { Component, OnInit, HostListener } from '@angular/core';
import { AuthService } from '../auth-service/auth.service';
import { Router } from '@angular/router';
@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.css'],
})
export class AuthComponent implements OnInit {
  isIframe = false;
  loggedIn = false;
  returnValue: boolean;
  GroupNames: any;
  newInnerHeight;
  newInnerWidth;
  @HostListener('window:resize', ['$event'])
  onResize(event) {
    this.newInnerHeight = event.target.innerHeight;
    this.newInnerWidth = event.target.innerWidth;
  }
  constructor(private router: Router, private authService: AuthService) {}

  ngOnInit() {
       this.isLoggedIn();
     /**
      * The user is redirected to the homepage if he navigates to the login page while he
      * is already logged in
      */
       if (this.isLoggedIn() && !this.checkExternalFirm()) {

          this.router.navigate(['/login']);
        }

  }
  /**
   * This method checks if the user is logged in (authenticated)
   * @returns true if the user has logged in
   *
   */
  isLoggedIn() {
    return this.authService.Authenticated();
  }

  /**
   * This method checks if the logged in user is an external firm
   * This needs to be checked in order to give the necessary permissions or roles
   */
  checkExternalFirm() {
    return this.authService.checkIfExternalFirm();
  }

}
