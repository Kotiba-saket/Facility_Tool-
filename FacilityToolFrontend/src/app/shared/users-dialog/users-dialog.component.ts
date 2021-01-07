import { Component, OnInit, Inject } from '@angular/core';
import { MatConfirmDialogComponent } from '../mat-confirm-dialog/mat-confirm-dialog.component';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from '../../auth-service/auth.service';
import { ActivatedRoute } from '@angular/router';
import { User } from 'src/app/models/User';

@Component({
  selector: 'app-users-dialog',
  templateUrl: './users-dialog.component.html',
  styleUrls: ['./users-dialog.component.css'],
})
export class UsersDialogComponent implements OnInit {
  /**
   * variables
   */
  public newUser: User;
  assignToUserInformation: User;
  selectUserInformation: User;
  UsersList: User[] = [];
  newInnerHeight;
  selectUsersList: User[] = [];
  newInnerWidth;
  userId: string;
  userName: string;
  role: string;
  constructor(
    @Inject(MAT_DIALOG_DATA) public data,
    public dialogRef: MatDialogRef<MatConfirmDialogComponent>,
    private toastr: ToastrService,
    private authService: AuthService,
    private route: ActivatedRoute
  ) {}

  ngOnInit() {
    this.role = this.data.role;
    this.getAllUsers();
    this.getAllUsersFromAzure();
  }

  /**
   * This method fetches all user roles
   * The users are extracted from the roles and pushed into the userList array variable
   * If a user is selected and given a role, the selected user information is pushed
   * into the selectUsersList
   */
  getAllUsers() {
    this.authService.getUsersListRoles().subscribe((res) => {
      res.forEach((element) => {
        if (element.role === this.role) {
          this.assignToUserInformation = {
            id: element.id,
            email: element.email,
            name: element.name,
          };
          this.UsersList.push(this.assignToUserInformation);
        } else {
          this.selectUserInformation = {
            id: element.id,
            email: element.email,
            name: element.name,
          };
          this.selectUsersList.push(this.selectUserInformation);
        }
      });
    });
  }

  /**
   * This method is responsible forr adding a new member to a particular role
   */
  addMember() {
    this.authService
      .addMemberToRole(this.userId, this.role, this.newUser)
      .subscribe((res) => {
        location.reload();
        this.toastr.success(`${this.userName} is toegevoegd.`);
      });
  }

  /**
   * This method is responsible forr removing an existing member from a particular role
   * @param id this is the id of the user
   * @param name this is the name of the user
   */
  removeMember(id, name) {
    this.authService.removeUsersFromRoles(id).subscribe((res) => {
      location.reload();
      this.toastr.success(`${name} is verwijderd.`);
    });
  }

  /**
   * This method is responsible for fetching all users from the azure directory
   */
  getAllUsersFromAzure() {
    this.authService.getAllUsers().subscribe((res: any) => {
      res.value.forEach((element) => {
        if (element.role === this.role) {
          this.assignToUserInformation = {
            id: element.id,
            email: element.userPrincipalName,
            name: element.displayName,
          };
          this.UsersList.push(this.assignToUserInformation);
        } else {
          this.selectUserInformation = {
            id: element.id,
            email: element.userPrincipalName,
            name: element.displayName,
          };
          this.selectUsersList.push(this.selectUserInformation);
        }
      });
    });
  }

  /**
   * This method sets the default value for the dropdown to the currntly selected user
   * The data of the selected user is saved into the string variable newUser
   * @param e this contains the data of the selected user
   */
  onUserChange(e) {
    this.userName = e.target.options[e.target.options.selectedIndex].text;
    this.userId = this.newUser.id;
  }
}
