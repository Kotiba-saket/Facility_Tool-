import { Component, OnInit, AfterViewInit } from '@angular/core';
import { Observable } from 'rxjs';
import { Title } from '@angular/platform-browser';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { map, shareReplay } from 'rxjs/operators';
import { AuthService } from '../auth-service/auth.service';
import { ReportService } from '../services/report.service';
import { Status } from '../models/Report';
import { ArchiveService } from '../services/archive.service';
import { Router } from '@angular/router';


@Component({
  selector: 'app-nav-bar',
  templateUrl: './nav-bar.component.html',
  styleUrls: ['./nav-bar.component.css'],
})
export class NavBarComponent implements OnInit {
  public title = 'Overzicht';
  isIframe = false;
  userID: string;
  userName: string;
  userEmail: string;
  GroupNames: string;
  notifList = [];
  accessToken: any;
  isSubLoaded: boolean;
  notification: boolean;

  /**
   * This checks to see if the device the page is opened meets a handset specification
   */
  isHandset$: Observable<boolean> = this.breakpointObserver
    .observe(Breakpoints.Handset)
    .pipe(
      map((result) => result.matches),
      shareReplay()
    );
  constructor(
    private breakpointObserver: BreakpointObserver,
    private titleService: Title,
    private router: Router,
    public authService: AuthService,
    public archiveService: ArchiveService,
    private reportService: ReportService
  ) {}

  ngOnInit() {

    /**
     * This checks first if the user in logged in
     * If the user is logged in, it saves the user info to localStorage for easy access
     * in our html pages
     * It also gets roles of logged in users to know which elements will be shown in the navbar
     * It also gets the title of the current page from the localStorage
     */
    if (this.isLoggedIn()) {

      this.authService.currentUserInfo().subscribe((resInfo) => {
        this.userName = resInfo.name;
        this.userEmail = resInfo.email;
        this.userID = resInfo.id;
        localStorage.setItem('UserID', this.userID);
        localStorage.setItem('UserName', this.userName);
      });
      this.authService.getRoles();
      this.authService.checkIfExternalFirm();

      const titleFromLocalstorage = sessionStorage.getItem('title');
      if (titleFromLocalstorage === null) {
      this.title = 'Overzicht';
      this.titleService.setTitle( 'Overzicht' );
    } else {
      this.title = titleFromLocalstorage;
      this.titleService.setTitle( titleFromLocalstorage );
    }
      this.authService.currentUserInfo().subscribe((resInfo) => {
      this.notification = resInfo.notification;
      this.getSubscribedReports();

    });
  }
}

/**
 * This method changes the title of pages from the previous page to that of the current page
 * @param newTitle this is the title of the current page
 */
  public setTitle(newTitle: string) {
    sessionStorage.setItem('title', newTitle);
    this.title = newTitle;
    this.titleService.setTitle(newTitle);
  }

  /**
   * This is the logout method. It really doesn't need any further explanation :)
   * After logout, the session storage and local storage is cleared
   */
  logout() {
    localStorage.clear();
    sessionStorage.clear();
  }

  /**
   * This method checks if the user is logged in
   * @returns true if the user was successfully authenticated
   *
   */
  isLoggedIn() {
    return this.authService.Authenticated();
  }

  /**
   * This method fetches all reports the logged in user has subscribed to
   * This helps to give the right data to notification badge on the navbar
   */
  getSubscribedReports() {
    this.archiveService.getSubscribedReports().subscribe((res: any) => {
      if (res !== null && res.length > 0) {
        res.forEach((element) => {
          if (
            element.status === Status.FINISHED ||
            element.status === Status.DISCARDED
          ) {
            this.notifList.push(element);
          }
        });
        this.isSubLoaded = true;
      } else {
        this.isSubLoaded = false;
      }
    });
  }
}
