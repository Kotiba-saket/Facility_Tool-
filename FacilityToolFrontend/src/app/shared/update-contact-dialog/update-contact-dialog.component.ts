import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { Emergency } from '../../models/Emergency';
import { EmergencyService } from '../../services/emergency/emergency.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-update-contact-dialog',
  templateUrl: './update-contact-dialog.component.html',
  styleUrls: ['./update-contact-dialog.component.css'],
})
export class UpdateContactDialogComponent implements OnInit {
  facilitaireContacts;
  ictContacts;
  logistiekContacts;
  didactischContacts;
  newInnerHeight;
  newInnerWidth;
  contacts: any;
  public logistiekeContact = [];
  public ICTContact = [];
  dpt;
  isLoaded: boolean;
  contact: Emergency;
  departments = [
    'Facilitaire diensten',
    'ICT diensten',
    'Logistieke diensten',
    'Didactisch diensten',
  ];
  selectedDepartment: string;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    // tslint:disable-next-line: max-line-length
    public dialogRef: MatDialogRef<UpdateContactDialogComponent>,
    private emergencyService: EmergencyService,
    private toastr: ToastrService
  ) {}

  ngOnInit() {
    this.getContact();
  }

  /**
   * This method fetches a specific contact from the emmergencyContacts collection based on id
   * The fetched contact is saved in the contact variable
   */
  getContact() {
    this.emergencyService.getContact(this.data.id).subscribe((data: any) => {
      if (data !== null) {
        this.contact = data;
        this.isLoaded = true;
      } else {
        this.isLoaded = false;
      }
    });
  }

  /**
   * This method closes an opened dialog when called
   */
  closeDialog() {
    this.dialogRef.close(false);
  }

  /**
   * This method sets the selected campus out of the dropdown as the default value
   * The information is saved in the selectedCampus variable
   * @param department this is the selected variable
   */
  onChange(department) {
    this.selectedDepartment = department;
  }

  /**
   * This method is responsible for updating an existing contact
   */
  updateContact() {
    this.emergencyService.updateContact(this.contact).subscribe(
      (res) => {
        this.toastr.success('De taak werd gewijzigd.', 'Succes!');
        location.reload();
      },
      (error) => {
        this.toastr.error('Er is een fout opgetreden.', 'Error!');
      }
    );
  }

  /**
   * This method is responsible for deleting an existing contact from the collection
   * based on id
   */
  deleteContact() {
    this.emergencyService.deleteContact(this.contact.id).subscribe((res) => {});
  }

  /**
   * This method is responsible for fetching all contacts belonging to the facility services
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
   * This method is responsible for fetching all contacts belonging to the logistic services
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
   * This method is responsible for fetching all contacts belonging to the ICT services
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
   * This method is responsible for fetching all contacts belonging to the repairs services
   */
  getDidactischContacts() {
    const department = 'Didactisch diensten';
    this.emergencyService
      .getContactByDepartment(department)
      .subscribe((res) => {
        this.didactischContacts = res;
      });
  }
}
