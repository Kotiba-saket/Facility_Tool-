import { Injectable } from '@angular/core';
import {
  HttpClient,
  HttpHeaders,

} from '@angular/common/http';
import * as jwt_decode from 'jwt-decode';
import { environment } from 'src/environments/environment';
import { User } from '../models/User';
import { Observable } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';

@Injectable()
export class AuthService {
  URL = environment.BaseURL;
  idToken: string;
  GroupNames: any;
  decoded;
  groupName: any;
  token: string;
  isAdmin = false;
  isLogistiekeMedewerker = false;
  isMedewerker = false;
  isFacilitaireCoordinator = false;
  isLogistiekeCoordinator = false;
  isOpleidinghoofd = false;
  isFacilitaireMedewerker = false;
  isExternalFirm = false;
  requestOptions;
  headerDict;
  routeId;
  constructor(private http: HttpClient) {
    this.idToken = localStorage.getItem('idToken');
    this.headerDict = {
      Authorization: 'Bearer ' + this.idToken,
    };
    this.requestOptions = {
      headers: new HttpHeaders(this.headerDict),
    };
  }
  /**
   * This method fetches all roles a user can be assigned to
   * @returns JSON object with information about the user roles
   */
  getRoles() {
    const admin = 'Admin';
    const logistiekeCoordinator = 'LogistiekeCoordinator';
    const logistiekeMedewerker = 'LogistiekeMedewerker';
    const facilitaireCoordinator = 'FacilitaireCoordinator';
    const Opleidinghoofd = 'Opleidinghoofd';
    const facilitaireMedewerker = 'FacilitaireMedewerker';
    const medewerker = 'Medewerker';
    this.idToken = localStorage.getItem('idToken');
    const headers: HttpHeaders = new HttpHeaders({
      Authorization: 'Bearer ' + this.idToken,
    });
    return this.http
      .get(this.URL + '/user/me', { headers })
      .subscribe((resGroupNames: User) => {
        this.GroupNames = resGroupNames.role;
        this.groupName = localStorage.setItem('GroupNames', this.GroupNames);
        if (this.GroupNames === admin) {
          this.isAdmin = true;
        } else if (this.GroupNames === logistiekeCoordinator) {
          this.isLogistiekeCoordinator = true;
        } else if (this.GroupNames === logistiekeMedewerker) {
          this.isLogistiekeMedewerker = true;
        } else if (this.GroupNames === facilitaireCoordinator) {
          this.isFacilitaireCoordinator = true;
        } else if (this.GroupNames === Opleidinghoofd) {
          this.isOpleidinghoofd = true;
        } else if (this.GroupNames === facilitaireMedewerker) {
          this.isFacilitaireMedewerker = true;
        } else if (this.GroupNames === medewerker) {
          this.isMedewerker = true;
        }
      });
  }

  /**
   * This method checks if a user is an external firm
   * If so, an id token is generated to enable the user view specific pages without logging in
   */
  checkIfExternalFirm() {
    this.idToken = localStorage.getItem('idToken');
    if (this.idToken != null) {
    this.decoded = jwt_decode(this.idToken);
    if ( this.decoded != null && this.decoded.role != null && this.decoded.role === 'externalFirm'
     && this.decoded.exp > (new Date().getTime() + 1) / 1000) {
    this.isExternalFirm = true;
    return true;
    }
  }
  }


  /**
   * This method checks if the user has logged in by searching the local storage or checking if the msal id token exists
   * @returns it returns true if the user is logged in
   */
  Authenticated() {
     this.routeId = location.pathname;
     this.idToken = localStorage.getItem('idToken');
     if (this.idToken != null) {

    this.decoded = jwt_decode(this.idToken);
    if ( this.decoded != null && this.decoded.exp > (new Date().getTime() + 1) / 1000 && this.decoded.role == null) {
     return true;
    }
  }

  }


  /**
   * This method fetches all users from the database
   */
  getAllUsers() {
    return this.http.get<any>(this.URL + '/user', this.requestOptions);
  }

  /**
   * This method fetches all informatio about the logged in user
   */
  currentUserInfo(): Observable<any>  {
    this.idToken = localStorage.getItem('idToken');
    this.headerDict = {
      Authorization: 'Bearer ' + this.idToken,
    };
    this.requestOptions = {
      headers: new HttpHeaders(this.headerDict),
    };
    return this.http.get<User>(this.URL + '/user/me', this.requestOptions);
  }

  /**
   * This method fetches all users and their roles from the databank
   */
  getUsersListRoles(): Observable<any> {
    return this.http.get<any>(this.URL + '/users', this.requestOptions);
  }

  /**
   * This method is responsible for adding a role to a new member
   * @param id this is the id of the role
   * @param role this is the role the member is given
   * @param user this is the new member
   */
  addMemberToRole(id, role, user: User) {
    const Body = {
      id: user.id,
      name: user.name,
      email: user.email,
      role,
    };
    return this.http.put<any>(
      this.URL + '/role/' + id,
      Body,
      this.requestOptions
    );
  }

  /**
   * This method removes a role assigned to a user
   * @param id this is the id of the role
   */
  removeUsersFromRoles(id) {
    return this.http.put<any>(
      this.URL + '/role-delete/' + id,
      null,
      this.requestOptions
    );
  }

  /**
   * This method updates the user notification if changes are made about a user role
   * @param id this is the id of the notification
   * @param notification this is the notification body
   */
  updateNotificationSetting(id, notification) {
    const body = {
      Notification: notification
    };
    return this.http.put<any>(this.URL + '/userNotification/' + id, {notification}, this.requestOptions);
  }

}
