import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { MsalService } from '@azure/msal-angular';

@Injectable()
export class AuthService {
  accessToken: string;
  private getGroupUrI: string = 'https://graph.microsoft.com/v1.0/me/memberOf';
  private getUserInfoUrI: string = 'https://graph.microsoft.com/v1.0/me';
  private getGroupListUrI: string = 'https://graph.microsoft.com/v1.0/groups';
  private getUsersListUrI: string = 'https://graph.microsoft.com/v1.0/users';
  GroupNames:any;
  groupName:any;
  isAdmin:boolean = false;
  isLogistiekeMedewerker:boolean = false;
  isMedewerker:boolean = false;
  isFacilitaireCoordinator:boolean = false;
  isLogistiekeCoordinator:boolean = false;
  isOpleidinghhofd:boolean = false;
  isFacilitaireMedewerker:boolean = false;

  constructor(private http:HttpClient, private msalService: MsalService) { }
  /**
   * het call graph API fetch informatie over groepen waartoe de user behoort
   * @returns json met groepen informatie zoals display name en Id
   */
   getGroups() {
    return this.http.get<any>(this.getGroupUrI).subscribe((resGroupNames) => {
      this.GroupNames = resGroupNames.value.map((x) => x.displayName);
      this.groupName= localStorage.setItem('GroupNames', this.GroupNames);
      this.groupName= localStorage.getItem('GroupNames');
      if(this.GroupNames.includes("Admins group")) {
        this.isAdmin = true;
      }else if (this.GroupNames.includes("Logistieke Coordinator group")){
        this.isLogistiekeCoordinator =true;
      }else if (this.GroupNames.includes("Logistieke Medewerker group")){
        this.isLogistiekeMedewerker =true;
      }else if (this.GroupNames.includes("Facilitaire Medewerker group")){
        this.isFacilitaireMedewerker =true;
      }else if (this.GroupNames.includes("Facilitaire Coordinator  group")){
        this.isFacilitaireCoordinator =true;
      }else if (this.GroupNames.includes("Opleidingshoofd group")){
        this.isOpleidinghhofd =true;
      }else if (this.GroupNames.includes("Medewerker group")){
        this.isMedewerker =true;
      }
    });

  }


   /**
   * het call graph API en fetch informatie overuser zoals naam en email
   * @returns json met user informatie zoals user name and email
   */
  getUserInfo() {
    return this.http.get<any>(this.getUserInfoUrI);
  }

  /**
   * het check als de gebruiker ingelogd in of niet door te zoeken bij de local storage of de msal.idtoken daar bestaat
   * @returns het returneerd true als user ingelogd is en false als niet
   */
  Authenticated() {
    if(this.msalService.getAccount())
    {
     return true
    }
   else {
     return false
   }
  }

  /**
   * dit methode calls een azure endpoint en returneert alle leden van het groep
   *
   * @param groupId dit is een id of gespecificeerd groep
   */
  getMembersOfGroup(groupId) {
    return this.http.get<any>(`https://graph.microsoft.com/v1.0/groups/${groupId}/members`);
  }

  /**
   * dit methode call een azure endpoint en returneert lijst met alle groepen
   */
  getGroupsList() {
    return this.http.get<any>(this.getGroupListUrI);
  }

  /**
   *  dit methode calls een azure endpoint om en led van een gespecificeerd groep te verwijderen
   *
   * @param userId  dit is het id van de user die we wille uithalen van de groep
   * @param groupId dit is de id of het gespecificeerd groep
   */
  removeUserFromGroup(userId, groupId){
    return this.http.delete<any>(`https://graph.microsoft.com/v1.0/groups/${groupId}/members/${userId}/$ref`);
  }

  /**
   *
   *   dit methode calls een azure endpoint om en led van een gespecificeerd groep toe te vogen
   * @param userId   dit is het id van de user die we wille toevoegen van de groep
   * @param groupId dit is de id of het gespecificeerd groep
   */
  addMemberToGroup(userId, groupId) {
    const body = {
      "@odata.id": `https://graph.microsoft.com/v1.0/users/${userId}`
    }
    return this.http.post<any>(`https://graph.microsoft.com/v1.0/groups/${groupId}/members/$ref`, body);
  }

  /**
   * dit methode calls een azure endpoint en returneert een lijst met alle users
   */
  getUsersList() {
    return this.http.get<any>(this.getUsersListUrI);
  }

}

