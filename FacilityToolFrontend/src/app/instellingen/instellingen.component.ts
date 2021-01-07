import { Component, OnInit, HostListener } from '@angular/core';
import { AuthService } from '../auth-service/auth.service';
import { AzureGroups, Category, Status } from '../models/Report';
import { ToastrService } from 'ngx-toastr';
import { CategoryService } from '../services/category.service';
import { MatDialog } from '@angular/material';
import { CategoryComponent } from '../category/category.component';
import { CreateExternalFirmDialogComponent } from '../create-external-firm-dialog/create-external-firm-dialog.component';
import { ExternalfirmsService } from '../services/externalfirms/externalfirms.service';
import { EmergencyService } from '../services/emergency/emergency.service';
import { MatContactsDiaglogComponent } from '../shared/mat-contacts-diaglog/mat-contacts-diaglog.component';
import { ExternalFirm } from '../models/ExternalFirm';
import { UsersDialogComponent } from '../shared/users-dialog/users-dialog.component';
import { UpdateContactDialogComponent } from '../shared/update-contact-dialog/update-contact-dialog.component';
import { CategoryModalComponent } from '../shared/category-modal/category-modal.component';
import { Emergency } from '../models/Emergency';
import { MailtemplateService } from '../services/mail-template/mailtemplate.service';
import { MailTemplate } from '../models/MailTemplate';
import { UpdateMailtemplateComponent } from '../update-mailtemplate/update-mailtemplate.component';
import { AddMailTemplateComponent } from '../shared/add-mail-template/add-mail-template.component';
import { User } from '../models/User';
import { ConstantPool } from '@angular/compiler';
import { not } from '@angular/compiler/src/output/output_ast';

@Component({
  selector: 'app-instellingen',
  templateUrl: './instellingen.component.html',
  styleUrls: ['./instellingen.component.css'],
})
export class InstellingenComponent implements OnInit {

  defaultSelected;
  selection: number;
  notificationChoice = ['Notificatie voor finale statussen', 'Notificatie voor alle statussen'];
  GroupNames: any;
  returnValue: boolean;
  externalFirmsList = [];
  Categories: Category[];
  status = Status;
  statusList = [];
  selectedStatuses: string[];
  externalFirms: ExternalFirm;
  GroupsInformation: AzureGroups;
  GroupsList: AzureGroups[] = [];
  UsersList: User[] = [];
  UsersListInformation: User;
  facilitaireContacts;
  ictContacts;
  logistiekContacts;
  didactischContacts;
  newInnerHeight;
  newInnerWidth ;
  notification: boolean;
  contact: Emergency;
  public logistiekeContact = [];
  public ICTContact = [];
  id: string;
  userId = localStorage.getItem('UserID');
  template: MailTemplate;
  templates = [];

  @HostListener('window:resize', ['$event'])
  onResize(event) {
    this.newInnerHeight = event.target.innerHeight;
    this.newInnerWidth = event.target.innerWidth;
  }
  constructor(
    public authService: AuthService,
    private categoryService: CategoryService,
    private dialog: MatDialog,
    private externalFirmsService: ExternalfirmsService,
    private toastr: ToastrService,
    private emergencyService: EmergencyService,
    private mailTemplateService: MailtemplateService
  ) {}

  ngOnInit() {
    this.getAllCategories();
    this.showAllFirms();
    this.getFacilityContacts();
    this.getLogisticContacts();
    this.getIctContacts();
    this.getDidactischContacts();
    this.statusList = Object.values(this.status);
    this.newInnerWidth = window.innerWidth;
    this.getAllTemplates();
    this.authService.currentUserInfo().subscribe(resInfo => {
      this.notification = resInfo.notification;
      if (this.notification) {this.defaultSelected = 1; } else {this.defaultSelected = 0; }
    });


  }

  /**
   * This method fetches all categories inside the database and is saved in the Categories array
   */
  getAllCategories() {
    this.categoryService.getAllCategories().subscribe((data: any) => {
      this.Categories = data;
    });
  }

  /**
   * This method is responsible for assigning a role to a user
   * It opens the UsersDialogComponent where the logic of the function is located
   * @param role this is the chosen role to be assigned
   */
  addRole(role): void {
    this.dialog.open(UsersDialogComponent, {
      width: '500px',
      autoFocus: false,
      maxHeight: '70vh',
      data: { role },
    });
  }

  /**
   * This method when called, adds an existing category to an existing department
   * It opens the CategoryComponent where the logic of the function is located
   * @param category this is the new category object
   */
  addCategory(category: Category): void {
    const dialogRef = this.dialog
      .open(CategoryComponent, {
        width: '500px',
        autoFocus: false,
        maxHeight: '70vh',
        data: { category },
      })
      .afterClosed()
      .subscribe((res) => {});
  }


  /**
   * This method when called, adds a new category to an existing department
   * It opens the CategoryModalComponent where the logic of the function is located
   */
  newCategory(): void {
    const dialogRef = this.dialog.open(CategoryModalComponent, {
      width: '500px',
      autoFocus: false,
    });
  }

  /**
   * This method fetches all the external firms inside the database and saves it inside
   * the externalFirmsList[] array;
   */
  showAllFirms() {
    this.externalFirmsService.getAllFirms().subscribe(
      (res: any) => {
        this.externalFirmsList = res;
      },
      (error) => {
        console.log(error);
      }
    );
  }

  /**
   * This method opens the  CreateExternalFirmDialogComponent dialog
   * The logic to create a new firm is inside this dialog
   */
  openCreateExternalFirmDialog() {
    this.dialog.open(CreateExternalFirmDialogComponent, {
      width: '550px',
      height: '430px',
      panelClass: 'confirm-dialog-container',
      disableClose: true,
    });
  }

  /**
   * This method opens the  CreateExternalFirmDialogComponent dialog
   * The logic to update an existing firm is inside this dialog
   * @param id this is the id of external firm to be updated
   */
  openEditExternalFirmDialog(id) {
    this.dialog.open(CreateExternalFirmDialogComponent, {
      width: '550px',
      height: '430px',
      panelClass: 'confirm-dialog-container',
      disableClose: true,
      data: {
        FirmId: id,
      },
    });
  }

  /**
   * This method opens the  UsersDialogComponent dialog
   * The logic to add users to groups is inside this dialog
   * @param id this is the id of the group to which users will be added
   * @param groupName this is the name of the group to which users will be added
   */
  openGroupUsersDialog(id, groupName) {
    this.dialog.open(UsersDialogComponent, {
      width: '550px',
      height: '430px',
      panelClass: 'confirm-dialog-container',
      disableClose: true,
      data: {
        groupId: id,
        groupName,
      },
    });
  }

  /**
   * This method is responsible for deleting an existing external firm
   * @param id this is the id of the firm to be deleted
   */
  removeExternalFirm(id) {
    this.externalFirmsService.deleteFirm(id).subscribe((res) => {});
    location.reload();
    this.toastr.success('External firm has been removed.');
  }

  /**
   * This method opens the  MatContactsDiaglogComponen dialog
   * The logic to add new contacts to the emergency contacts is inside this dialog
   */
  openAddContactDialog() {
    this.dialog.open(MatContactsDiaglogComponent, {
      width: '620px',
      height: '620px',
    });
  }

  /**
   * This method opens the  UpdateContactDialogComponent dialog
   * The logic to update an existing contact is inside this dialog
   * @param id this is the id of the contact that will be updated
   */
  openUpdateContactDialog(id) {
    this.dialog.open(UpdateContactDialogComponent, {
      width: '620px',

      height: '620px',
      data: {
        id,
      },
    });
  }

  /**
   * This method is responsible for deleting an existing contact from our database
   * The id of the target contact must be given as parameter
   * @param id this is the id of the contact to be deleted
   */
  deleteContact(id) {
    this.emergencyService.deleteContact(id).subscribe((res) => {
      if (res) {
        location.reload();
        this.toastr.success('Contact is verwijdered.');
      }
    });
  }

  /**
   * This method fetches contacts from our database depending on their id
   * @param id this.is the id of the target contact
   */
  getContactById(id) {
    this.openUpdateContactDialog(id);
  }

  /**
   *  This method fetches all emergency contacts under the facility service department
   */
  getFacilityContacts() {
    const department = 'Facilitaire diensten';
    this.emergencyService
      .getContactByDepartment(department)
      .subscribe((res) => {
        this.facilitaireContacts = res;
      });
  }

  /**
   * This method fetches all emergency contacts under the logistic service department
   */
  getLogisticContacts() {
    const department = 'Logistieke diensten';
    this.emergencyService
      .getContactByDepartment(department)
      .subscribe((res) => {
        this.logistiekContacts = res;
      });
  }

  /**
   * This method fetches all emergency contacts under the ICT service department
   */
  getIctContacts() {
    const department = 'ICT diensten';
    this.emergencyService
      .getContactByDepartment(department)
      .subscribe((res) => {
        this.ictContacts = res;
      });
  }

  /**
   * This method fetches all emergency contacts under the repair service department
   */
  getDidactischContacts() {
    const department = 'Didactisch diensten';
    this.emergencyService
      .getContactByDepartment(department)
      .subscribe((res) => {
        this.didactischContacts = res;
      });
  }

  /**
   * This method opens the  AddMailTemplateComponent dialog
   * The logic to add a new mail template is inside this dialog
   */
  openAddMailTemplate() {
    this.dialog.open(AddMailTemplateComponent, {
      width: '950px',
      height: '420px',
    });
  }

  /**
   * This method opens the  UpdateMailtemplateComponent dialog
   * The logic to update an existing mail template is inside this dialog
   * @param id this is the id of the template to be updated
   */
  openUpdateMailTemplateDialog(id) {
    this.dialog.open(UpdateMailtemplateComponent, {
      width: '950px',

      height: '240px',
      data: {
        id,
      },
    });
  }
  /**
   * This method fetches a template from the database based on the given id
   * It also opens the openUpdateMailTemplateDialog where the logic to update the template is found
   * The dialog also fetches the data of the selected template based on its id
   * @param id this is the id of the template called by this method
   */
  getTemplateById(id) {
    this.openUpdateMailTemplateDialog(id);
  }

  /**
   * This method fetches a specific mail template depending on the id of the selected template
   */
  getTemplate() {
    this.mailTemplateService.getTemplate(this.id).subscribe((res: any) => {
      this.template = res;
    });
  }

/**
 * This method changes the type of notification you receive based on the selected option
 * @param selection this is the selected notification type
 */
changeNotif(selection) {
  switch (selection) {
    case 0:
      this.authService.updateNotificationSetting(this.userId, false).subscribe(res => {
        this.notification = false;
        this.toastr.success(`U zal nu notificaties krijgen voor finale statussen.`);
      }, error => {
        this.toastr.error(`U ontvangt al notificaties voor finale statussen.`);
      });
      break;
    case 1:
      this.authService.updateNotificationSetting(this.userId, true).subscribe(res => {
        this.notification = true;
        this.toastr.success(`U zal nu notificaties krijgen voor alle statussen.`);
      }, error => {
        this.toastr.error(`U ontvangt al notificaties voor alle statussen.`);
      });
      break;
  }
}

/**
 * This method fetches all templates from the database and saves it to the templates[] array
 */
  getAllTemplates() {
    this.mailTemplateService.getAllTemplates().subscribe((res: any) => {
      this.templates = res;
    });
  }

  /**
   * This method is responsible for updating a mail template
   */
  updateTemplate() {
    this.mailTemplateService.updateTemplate(this.template).subscribe((res) => {
      location.reload();
    });
  }

  /**
   * This method fetches an external firm from the database and displays its contents in the
   * openEditExternalFirmDialog dialog where the logic to update the firm is found
   * @param id this is the id of the firm to be fetched from the database
   */
  getFirmById(id) {
    this.openEditExternalFirmDialog(id);
  }

  /**
   * This method opens the  openGroupUsersDialog dialog
   * It shows all members of a group based on the name of the group
   * @param groupId this is the id of the target group
   * @param groupName this is the name of the group
   */
  openUsersDialog(groupId, groupName) {
    this.openGroupUsersDialog(groupId, groupName);
  }
}
