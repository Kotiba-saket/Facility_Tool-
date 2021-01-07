import { Component, OnInit,AfterViewInit } from '@angular/core';
import { Observable } from 'rxjs';
import { Title } from '@angular/platform-browser';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { map, shareReplay } from 'rxjs/operators';
import { MsalService, BroadcastService } from '@azure/msal-angular';
import { AuthService } from '../auth-service/auth.service';
import { Report, Status } from '../models/Report';
import { ArchiveService } from '../services/archive.service';

@Component({
  selector: 'app-nav-bar',
  templateUrl: './nav-bar.component.html',
  styleUrls: ['./nav-bar.component.css']
})
export class NavBarComponent implements OnInit  {
  loggedIn = false;
  public title: string = "Overzicht";
  isIframe = false;
  userID: string;
  userName: string;
  userEmail: string;
  GroupNames: string;
  notifList = [];
  isSubLoaded:Boolean;

  isHandset$: Observable<boolean> = this.breakpointObserver.observe(Breakpoints.Handset)
    .pipe(
      map(result => result.matches),
      shareReplay()
    );
  constructor(private breakpointObserver: BreakpointObserver, private titleService: Title,private msalService: MsalService,public authService: AuthService, public archiveService: ArchiveService) {

  }




   ngOnInit() {
     this.getSubscribedReports();

    if(this.isLoggedIn()){


      /**
       * we krijgen hier json informatie van getuserunfor function, en we storen de display name en email in variablen
       *  zodat we het kunne gebruiken binnen onze html pagina
       */
     this.authService.getUserInfo().subscribe(userInforData => {
      this.userName = userInforData.displayName
      this.userEmail=userInforData.userPrincipalName
      this.userID = userInforData.id;
      localStorage.setItem('UserID', this.userID);
      localStorage.setItem('UserName', this.userName);
     });
     this.authService.getGroups();

    }
    /**
     * get Navside title from localstorage
     */
    let titleFromLocalstorage = sessionStorage.getItem("title")
    if(titleFromLocalstorage === null) {
      this.title = "Overzicht"
      this.titleService.setTitle( "Overzicht" );
    }else {
      this.title = titleFromLocalstorage;
      this.titleService.setTitle( titleFromLocalstorage );
    }

   }




  public setTitle( newTitle: string) {
    sessionStorage.setItem("title", newTitle);
    this.title = newTitle;
    this.titleService.setTitle( newTitle );
  }
  /**
   * het log de user uit als hij ingelogd is
   */
  logout() {
    this.msalService.logout();
    localStorage.clear();
    sessionStorage.clear();
  }
   /**
   * het checkt als de gebruiker ingelogd is of niet
   * @returns true als de gebruiker ingelogd is en false als niet
   *
   */
  isLoggedIn() {
    return this.authService.Authenticated();
  }

  getSubscribedReports(){
    this.archiveService.getSubscribedReports().subscribe((res) => {
      if(res !== null && res.length > 0) {
        res.forEach(element => {
          if(element.status == Status.FINISHED || element.status == Status.DISCARDED){
            this.notifList.push(element);
          }
        }
          )
        this.isSubLoaded = true;
      } else {
        this.isSubLoaded = false;
      }
    });
  }




}
