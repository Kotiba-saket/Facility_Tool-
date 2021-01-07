import { Component, OnInit, HostListener } from '@angular/core';
import { AuthService } from '../auth-service/auth.service';
import { AzureGroups, Category, Status } from '../models/Report';
import { ToastrService } from 'ngx-toastr';
import { CategoryService } from '../services/category.service';
import { MatDialog } from '@angular/material';
import { CategoryComponent } from '../category/category.component';
import { CreateExternalFirmDialogComponent } from '../create-external-firm-dialog/create-external-firm-dialog.component';
import { ExternalfirmsService } from '../services/externalfirms/externalfirms.service';
import { SSL_OP_LEGACY_SERVER_CONNECT } from 'constants';
import { Emergency } from '../models/emergency';
import {EmergencyService} from '../services/emergency/emergency.service';
import { MatContactsDiaglogComponent } from '../mat-contacts-diaglog/mat-contacts-diaglog.component';
import { ExternalFirm } from '../models/ExternalFirm';
import { UsersDialogComponent } from '../users-dialog/users-dialog.component';
import { UpdateContactDialogComponent } from '../update-contact-dialog/update-contact-dialog.component';
import { CategoryModalComponent } from '../Modal/category-modal/category-modal.component';

@Component({
  selector: 'app-instellingen',
  templateUrl: './instellingen.component.html',
  styleUrls: ['./instellingen.component.css']
})

export class InstellingenComponent implements OnInit {

  /**
   * Variables
   */
  GroupNames: any;
  returnValue: boolean;
  externalFirmsList= [];
  Categories:Category[];
  status = Status;
  statusList = [];
  selectedStatuses: String[];
  externalFirms: ExternalFirm;
  GroupsInformation: AzureGroups;
  GroupsList: AzureGroups[] = [];
  facilitaireContacts;
  ictContacts;
  logistiekContacts;
  didactischContacts;
  newInnerHeight;
  newInnerWidth ;
  contact: Emergency;
  public logistiekeContact = [];
  public ICTContact = [];
  id: string;

  @HostListener('window:resize', ['$event'])
  onResize(event) {
    this.newInnerHeight = event.target.innerHeight;
    this.newInnerWidth = event.target.innerWidth;
    console.log(this.newInnerWidth);
  }
  // tslint:disable-next-line: max-line-length
  constructor(public authService: AuthService, private categoryService: CategoryService, private dialog: MatDialog, private externalFirmsService: ExternalfirmsService, private toastr: ToastrService, private emergencyService: EmergencyService) { }

  ngOnInit() {
    this.getAllCategories();
    this.showAllFirms();
    this.getListOFGroups();
    this.getFacilityContacts();
    this.getLogisticContacts();
    this.getIctContacts();
    this.getDidactischContacts();
    this.statusList = Object.values(this.status);
    this.newInnerWidth = window.innerWidth;
  }



  getAllCategories() {
    this.categoryService.getAllCategories().subscribe(data => {
      this.Categories = data;
    });
  }

  addCategory(category: Category): void {
    const dialogRef = this.dialog.open(CategoryComponent, {
      width: '500px',
      autoFocus: false,
      maxHeight: '70vh',
      data: {category}
    }).afterClosed().subscribe(res => {

    });
  }

  newCategory(): void {
    const dialogRef = this.dialog.open(CategoryModalComponent, {
      width: '500px',
      autoFocus: false,
    });
  }


  /**
   * toon een lijst van alle bestaande firms
   */
 showAllFirms() {
   this.externalFirmsService.getAllFirms().subscribe(res => {
      this.externalFirmsList = res;
   });
 }

 /**
  * met dit functie wordt de dialog van create external firm geopened
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
  * met dit functie wordt de dialog van edit external firm geopened
  */
 openEditExternalFirmDialog(id) {
  this.dialog.open(CreateExternalFirmDialogComponent, {
    width: '550px',
    height: '430px',
    panelClass: 'confirm-dialog-container',
    disableClose: true,
    data: {
      FirmId: id
    }
  });
 }

 /**
  * met dit functie wordt de dialog van alle users van groep geopened
  */
 openGroupUsersDialog(id ,groupName) {
  this.dialog.open(UsersDialogComponent,{
    width: '550px',
    height: '430px',
    panelClass: 'confirm-dialog-container',
    disableClose: true,
    data: {
      groupId: id,
      groupName
    }
  });
 }

 /**
  * wordt external firm verwijdert.
  * @param id het id van external firm die we willen verwijderen.
  */
 removeExternalFirm(id) {
   this.externalFirmsService.deleteFirm(id).subscribe(res => {
   });
   location.reload();
   this.toastr.success('External firm has been removed.');

 }

/**
 * Deze fuctie roept de "MatContactsDialogComponent" aan om een nieuwe contact te aanmaken
 */
 openAddContactDialog() {
  this.dialog.open(MatContactsDiaglogComponent, {
    width: '620px',
    height: '620px',
  });
 }


 /**
  * Deze functie roept de "UpdateContactDialogComponent" aan om een contact te updaten
  */
openUpdateContactDialog(id) {
  this.dialog.open(UpdateContactDialogComponent, {
    width: '620px',

    height: '620px',
    data: {
      id
    }
  });
}


/**
 * Deze functie zorg voor het verwijderen van een contact
 */
deleteContact(id) {
  this.emergencyService.deleteContact(id).subscribe(res => {
    console.log(res);
    if (res) {
    location.reload();
    this.toastr.success('Contact is verwijdered.');
    }
  });

}

getContactById(id) {
  this.openUpdateContactDialog(id);
}


/**
 *  Deze functie haalt alle contacten onder facilitaire diensten op
 */
 getFacilityContacts() {
  const department = 'Facilitaire';
  this.emergencyService.getContactByDepartment(department).subscribe(res => {
    this.facilitaireContacts = res;
    console.log(this.facilitaireContacts);
  });
}


/**
 * Deze functie haalt alle contacten onder logistieke diensten op
 */
getLogisticContacts() {
  const department = 'Logistieke';
  this.emergencyService.getContactByDepartment(department).subscribe(res => {
    this.logistiekContacts = res;
    console.log(this.logistiekContacts);
  });
}


/**
 * Deze functie haalt alle contacten onder ICT diensten op
 */
getIctContacts() {
  const department = 'ICT';
  this.emergencyService.getContactByDepartment(department).subscribe(res => {
    this.ictContacts = res;
    console.log(this.ictContacts);
  });
}



/**
 * Deze functie haalt alle contacten onder Herstelling(Didactisch) diensten op
 */
getDidactischContacts() {
  const department = 'Didactisch';
  this.emergencyService.getContactByDepartment(department).subscribe(res => {
    this.didactischContacts = res;
    console.log(this.didactischContacts);
  });
}


 getFirmById(id) {
      this.openEditExternalFirmDialog(id);
}

/**
 * bij dit methode krijgen we een lijst van alle groepen die al bestaan
 */
getListOFGroups() {
  this.authService.getGroupsList().subscribe(res => {
    res.value.forEach(element => {
      this.GroupsInformation = {
        Id: element.id,
        displayName: element.displayName,
        description: element.description
      };
      this.GroupsList.push(this.GroupsInformation);
     });
  });
}

openUsersDialog(groupId, groupName) {
this.openGroupUsersDialog(groupId , groupName);
}
}
