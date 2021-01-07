import { Component, OnInit, HostListener } from '@angular/core';
import { Emergency } from '../models/emergency';
import {EmergencyService} from '../services/emergency/emergency.service';
import {MatExpansionModule} from '@angular/material/expansion';
import { Router } from '@angular/router';
import { from } from 'rxjs';

@Component({
  selector: 'app-noodgeval',
  templateUrl: './noodgeval.component.html',
  styleUrls: ['./noodgeval.component.css']
})
export class NoodgevalComponent implements OnInit {

  contact: Emergency;
  facilitaireContacts;
  ictContacts;
  logistiekContacts;
  didactischContacts;
  newInnerHeight;
  newInnerWidth ;
  contacts: any;
  public logistiekeContact = [];
  public ICTContact = [];

  @HostListener('window:resize', ['$event'])
  onResize(event) {
    this.newInnerHeight = event.target.innerHeight;
    this.newInnerWidth = event.target.innerWidth;
    console.log(this.newInnerWidth);
  }

  constructor(private emergencyService: EmergencyService) { }


  ngOnInit() {
    this.emergencyService.getAllContacts().subscribe(res => {
      this.contacts = res;
      console.log(this.contacts);
    });

    this.getFacilityContacts();
    this.getLogisticContacts();
    this.getIctContacts();
    this.getDidactischContacts();

    this.newInnerWidth = window.innerWidth;
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

}
