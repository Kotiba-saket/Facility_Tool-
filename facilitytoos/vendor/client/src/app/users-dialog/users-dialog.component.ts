import { Component, OnInit, Inject, HostListener } from '@angular/core';
import { MatConfirmDialogComponent } from '../mat-confirm-dialog/mat-confirm-dialog.component';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from '../auth-service/auth.service';
import { ActivatedRoute } from '@angular/router';
import { AzureUser } from '../models/Order';

@Component({
  selector: 'app-users-dialog',
  templateUrl: './users-dialog.component.html',
  styleUrls: ['./users-dialog.component.css']
})
export class UsersDialogComponent implements OnInit {

  /**
   * variables
   */
  groupId: string;
  groupName: string;
  UserOfGroupInformation:AzureUser;
  groupUsersList: AzureUser[] = [];
  UserInformation:AzureUser;
  UsersList: AzureUser[] = [];
  newInnerHeight;
  newInnerWidth;
  constructor(@Inject(MAT_DIALOG_DATA) public data,
  public dialogRef: MatDialogRef<MatConfirmDialogComponent>, private toastr: ToastrService, private authService: AuthService,private route:ActivatedRoute ,) { }
  @HostListener('window:resize', ['$event'])
  onResize(event) {
    this.newInnerHeight = event.target.innerHeight;
    this.newInnerWidth = event.target.innerWidth;

  }


  ngOnInit() {
    this.groupId = this.data.groupId;
    this.groupName=this.data.groupName;
    this.getGroupMembers();
    this.getListOfUsers();
    this.newInnerWidth = window.innerWidth;
  }

  /**
   * we krijgen hier een lijst van alle leden die behoren aan specifiek groep
   */
getGroupMembers() {
  this.authService.getMembersOfGroup(this.groupId).subscribe(res => {
    console.log(res)
    res.value.forEach(element => {
      this.UserOfGroupInformation = {
        azureUserId: element.id,
        displayName:element.displayName,
        Email:element.userPrincipalName
      }
      this.groupUsersList.push(this.UserOfGroupInformation);
     });
   })
  }

  /**
   * we krijgen hier een lijst van alle leden die behoren aan specifiek groep
   */
   getListOfUsers() {
    this.authService.getUsersList().subscribe( Res => {
     Res.value.forEach(element => {
     this.UserInformation = {
       azureUserId: element.id,
       displayName:element.displayName,
       Email: element.userPrincipalName
     }
     this.UsersList.push(this.UserInformation);
    });
   });
   }

/**
   * als we een employee geselecteerd hebben van de select opties, dan nemen we hier het id en naam van de geselecteerd employee
   * @param e heeft informatie zoals id en de naam van de geselecteerde optie
   */
   onUserChange(e){
    this.UserInformation = {
      azureUserId:  e.target.value,
      displayName:e.target.options[e.target.options.selectedIndex].text
    }
  }

  /**
   * nadat we een user geselecteerd hebben, dit methode voegt de geselcteerde user toe aan het gespcifieerd groep
   */
  addMember() {
    this.authService.addMemberToGroup(this.UserInformation.azureUserId , this.groupId).subscribe(res => {
      console.log(res);
      location.reload();
      this.toastr.success(`${this.UserInformation.displayName} is toegevoegd.`)

    }, error => {
      this.toastr.error(`${this.UserInformation.displayName} is al bestaat in de groep.`)
    })
  }

  /**
   * nadat we een user geselecteerd hebben, dit methode verwijdert de geselcteerde user vanuit het gespcifieerd groep
   */
  removeMember(userId) {
    this.authService.removeUserFromGroup(userId , this.groupId).subscribe(res => {
      location.reload();
      this.toastr.success(`${this.UserInformation.displayName} is verwijderd.`)
    }, error => {
      this.toastr.error(`Er is een error met ${this.UserInformation.displayName} user verwijderen`)
    })
  }

}
