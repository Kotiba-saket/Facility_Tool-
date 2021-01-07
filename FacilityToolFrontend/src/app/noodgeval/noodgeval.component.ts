import { Component, OnInit, HostListener } from '@angular/core';
import { Emergency } from '../models/Emergency';
import { EmergencyService } from '../services/emergency/emergency.service';

@Component({
  selector: 'app-noodgeval',
  templateUrl: './noodgeval.component.html',
  styleUrls: ['./noodgeval.component.css'],
})
export class NoodgevalComponent implements OnInit {
  contact: Emergency;
  facilitaireContacts;
  ictContacts;
  logistiekContacts;
  didactischContacts;
  newInnerHeight;
  newInnerWidth;
  contacts: any;
  public logistiekeContact = [];
  public ICTContact = [];

  /**
   * This method passes logic depending on the size of the screen
   * @param event this holds the width of the current page
   */
  @HostListener('window:resize', ['$event'])
  onResize(event) {
    this.newInnerHeight = event.target.innerHeight;
    this.newInnerWidth = event.target.innerWidth;
  }

  constructor(private emergencyService: EmergencyService) {}

  ngOnInit() {
    this.emergencyService.getAllContacts().subscribe((res) => {
      this.contacts = res;
    });

    this.getFacilityContacts();
    this.getLogisticContacts();
    this.getIctContacts();
    this.getDidactischContacts();

    this.newInnerWidth = window.innerWidth;
  }

  /**
   * This method fetches all contacts belonging to the facility services
   * The fetched data is stored inside the 'facilitaireContacts' array variable
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
   * This method fetches all contacts belonging to the logistic services
   * The fetched data is stored inside the 'logistiekeContacts' array variable
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
   * This method fetches all contacts belonging to the ICT services
   * The fetched data is stored inside the 'ictContacts' array variable
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
   * This method fetches all contacts belonging to the repair services
   * The fetched data is stored inside the 'didactischContacts' array variable
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
