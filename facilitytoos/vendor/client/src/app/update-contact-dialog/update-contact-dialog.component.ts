import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { Emergency } from '../models/emergency';
import { EmergencyService } from '../services/emergency/emergency.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-update-contact-dialog',
  templateUrl: './update-contact-dialog.component.html',
  styleUrls: ['./update-contact-dialog.component.css']
})
export class UpdateContactDialogComponent implements OnInit {
  facilitaireContacts;
  ictContacts;
  logistiekContacts;
  didactischContacts;
  newInnerHeight;
  newInnerWidth ;
  contacts: any;
  public logistiekeContact = [];
  public ICTContact = [];
  dpt;
  isLoaded: boolean;
  contact: Emergency;
  departments = [
    'Facilitaire',
    'ICT',
    'Logistieke',
    'Didactisch'
  ];
  selectedDepartment: string;

  constructor(@Inject(MAT_DIALOG_DATA) public data: any,
              // tslint:disable-next-line: max-line-length
              public dialogRef: MatDialogRef<UpdateContactDialogComponent>, private emergencyService: EmergencyService, private toastr: ToastrService) { }

  ngOnInit() {
    this.getContact();

    // if(this.data.department) {
    //   this.emergencyService.getContactByDepartment(this.data.department).subscribe(res => {
    //     this.contact = res;
    //     console.log(this.contact)
    // });
    // }

    // this.emergencyService.getAllContacts().subscribe(res => {
    //   this.contacts = res;
    //   console.log(this.contacts);
    // });
  }

  getContact(){
    this.emergencyService.getContact(this.data.id).subscribe(data => {
      if(data !== null){
        this.contact = data;
        this.isLoaded = true;
      } else{
        this.isLoaded = false;
      }
    });
  }

  closeDialog() {
    this.dialogRef.close(false);
  }

  onChange(department) {
    this.selectedDepartment = department;
    console.log(this.selectedDepartment);
  }

  updateContact() {
    this.emergencyService.updateContact(this.contact).subscribe(res => {
      this.toastr.success('De taak werd gewijzigd.', 'Succes!');
      location.reload();
    }, error => {
      this.toastr.error('Er is een fout opgetreden.', 'Error!');
    });
  }

  deleteContact() {
    this.emergencyService.deleteContact(this.contact.id).subscribe(res => {
      console.log(res);
    })
  }

  getFacilityContacts() {
    const department = 'Facilitaire';
    this.emergencyService.getContactByDepartment(department).subscribe(res => {
      this.facilitaireContacts = res;
      console.log(this.facilitaireContacts);
    })
  }

  getLogisticContacts() {
    const department = 'Logistieke';
    this.emergencyService.getContactByDepartment(department).subscribe(res => {
      this.logistiekContacts = res;
      console.log(this.logistiekContacts);
    })
  }


  getIctContacts() {
    const department = 'ICT';
    this.emergencyService.getContactByDepartment(department).subscribe(res => {
      this.ictContacts = res;
      console.log(this.ictContacts);
    })
  }


  getDidactischContacts() {
    const department = 'Didactisch';
    this.emergencyService.getContactByDepartment(department).subscribe(res => {
      this.didactischContacts = res;
      console.log(this.didactischContacts);
    })
  }


  getContactByDepartment() {
    if (this.dpt === 'Facilitaire') {
      this.emergencyService.getContactByDepartment(this.dpt).subscribe(res => {
        this.contact = res;
        console.log(this.contact);
      });
    }
    if (this.dpt === 'Logistiek') {
      this.emergencyService.getContactByDepartment(this.dpt).subscribe(res => {
        this.contact = res;
        console.log(this.contact);
      });
    }
    if (this.dpt === 'ICT') {
      this.emergencyService.getContactByDepartment(this.dpt).subscribe(res => {
        this.contact = res;
        console.log(this.contact);
      });
    }
    if (this.dpt === 'Didactisch') {
      this.emergencyService.getContactByDepartment(this.dpt).subscribe(res => {
        this.contact = res;
        console.log(this.contact);
      });
    }
  }


}
