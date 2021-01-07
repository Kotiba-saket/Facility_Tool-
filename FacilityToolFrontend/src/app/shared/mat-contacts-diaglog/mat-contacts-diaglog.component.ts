import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { Emergency } from '../../models/Emergency';
import { ToastrService } from 'ngx-toastr';
import { EmergencyService } from '../../services/emergency/emergency.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-mat-contacts-diaglog',
  templateUrl: './mat-contacts-diaglog.component.html',
  styleUrls: ['./mat-contacts-diaglog.component.css'],
})
export class MatContactsDiaglogComponent implements OnInit {
  isLoaded: boolean;
  departments = [
    'Facilitaire diensten',
    'ICT diensten',
    'Logistieke diensten',
    'Didactisch diensten',
  ];
  id: string;

  public contact: Emergency = new Emergency();
  selectedDepartment: string;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data,
    // tslint:disable-next-line: max-line-length
    public dialogRef: MatDialogRef<MatContactsDiaglogComponent>,
    private emergencyService: EmergencyService,
    private toastr: ToastrService,
    private router: Router
  ) {}

  ngOnInit() {
    this.getContact();
  }

  /**
   * This method fetches a specific contact from the emmergencyContacts collection based on id
   * The fetched contact is saved in the contact variable
   */
  getContact() {
    this.emergencyService.getContact(this.id).subscribe((res: any) => {
      if (res !== null) {
        this.contact = res;
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
  onDepartmentChange(department) {
    this.selectedDepartment = department;
  }

  /**
   * This method is responsible for adding a new contact to the collection
   */
  addContact() {
    this.emergencyService.createContact(this.contact).subscribe(
      (res) => {
        this.toastr.success('De contact werd toegevoegd.', 'Succes!');
        // location.reload();
      },
      (error) => {
        this.toastr.error('Er is een fout opgetreden.', 'Error!');
      }
    );
    location.reload();
  }
}
