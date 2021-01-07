import { Report } from 'src/app/models/Report';
import { Location } from '@angular/common';
import { Component, OnInit, HostListener } from '@angular/core';
import { ReportService } from '../services/report.service';
import {
  ELLfloor,
  NOOfloor,
  ELLLocationfloorMin_1,
  ELLLocationfloor_0,
  ELLLocationfloor_1,
  ELLLocationfloor_2,
  ELLLocationfloor_3,
  ELLLocationfloor_4,
  NOOLocationfloorMin_1,
  NOOLocationfloor_0,
  NOOLocationfloor_1,
  NOOLocationfloor_2,
  NOOLocationfloor_3,
  NOOLocationfloor_4,
  NOOLocationfloor_5,
} from '../models/groundplans';
import { Campus } from '../models/Report';

@Component({
  selector: 'app-defect-melden',
  templateUrl: './defect-melden.component.html',
  styleUrls: ['./defect-melden.component.css'],
})
export class DefectMeldenComponent implements OnInit {
  constructor(
    private reportService: ReportService,
    private location: Location
  ) {}
  newInnerHeight;
  newInnerWidth;
  reports: Report[];
  filterdReports: Report[] = ([] = []);
  filterdReportsByCampus: Report[] = [];
  filterdReportsByFloor: Report[] = [];
  filterdReportsByLocation: Report[] = [];
  searchText;
  isReportLoaded: boolean;
  retrievedImage: string;
  public direction = 'desc'; // asc desc
  public sortBy = 'title';
  public floors: string[];
  public locaties: string[];
  selectedCampus: string;
  public campusenOption = [];

  campusen = Campus;
  columnsToSort = [
    { value: 'title', viewValue: 'Titel' },
    { value: 'category', viewValue: 'Categorie' },
    { value: 'location', viewValue: 'Locatie' },
    { value: 'status', viewValue: 'Status' },
    { value: 'upVote', viewValue: 'Stemmen' },
  ];
  @HostListener('window:resize', ['$event'])

  /**
   * This method passes logic depending on the size of the screen
   * @param event this holds the width of the current page
   */
  onResize(event) {
    this.newInnerHeight = event.target.innerHeight;
    this.newInnerWidth = event.target.innerWidth;
  }

  ngOnInit() {
    this.newInnerWidth = window.innerWidth;
    this.campusenOption = Object.keys(this.campusen);
    this.filterdReports = null;
    this.getAllReports();
  }

  /**
   * This method checks the priority a report has and then gives it a color
   * @param priority this is the priority which is checked to specify the color
   */
  setPriorityColor(priority): string {
    switch (priority) {
      case 'HIGH':
        return '#af0412'; // Red
      case 'NORMAL':
        return '#ffa500'; // Orange
      case 'LOW':
        return '#28a745'; // Green
    }
  }

  /**
   * This method fetches all reports in the database and saves the in the array Reports[]
   */
  getAllReports() {
    this.reportService.getReports().subscribe(
      (data: any) => {
        if (data !== null && data.length > 0) {
          this.reports = data;
          this.isReportLoaded = true;
        } else {
          this.isReportLoaded = false;
        }
      },
      (err) => {
        console.log(err);
      }
    );
  }

  /**
   * The sortBy() method sorts reports in ascending or descending order
   * This method in only callled in the mobile view
   */
  SortBy() {
    // asc desc
    switch (this.direction) {
      case 'asc':
        return (this.direction = 'desc');
      case 'desc':
        return (this.direction = 'asc');
      default:
        return (this.direction = 'desc');
    }
  }

  /**
   * This method checks which campus is selected
   * @param event this is the selected campus
   * @returns a list of all the floors based on the selected campus
   */
  onCampusChange(event) {
    if (event.value === 'ELL') {
      this.floors = ELLfloor;
      this.selectedCampus = 'ELL';
      this.filterdReports = this.reports.filter(
        (x) => x.campus === this.selectedCampus
      );
      this.filterdReportsByCampus = this.filterdReports;
    } else {
      this.floors = NOOfloor;
      this.selectedCampus = 'NOO';
      this.filterdReports = this.reports.filter(
        (x) => x.campus === this.selectedCampus
      );
      this.filterdReportsByCampus = this.filterdReports;
    }
  }

  /**
   * This method checks which floor is selected
   * @param event this is the selected floor
   * @returns a list of all rooms based on the selected floor
   */
  onEtageChange(event) {
    if (this.selectedCampus === 'ELL') {
      if (event.value === '-1') {
        this.locaties = ELLLocationfloorMin_1;
      } else if (event.value === '0') {
        this.locaties = ELLLocationfloor_0;
      } else if (event.value === '1') {
        this.locaties = ELLLocationfloor_1;
      } else if (event.value === '2') {
        this.locaties = ELLLocationfloor_2;
      } else if (event.value === '3') {
        this.locaties = ELLLocationfloor_3;
      } else if (event.value === '4') {
        this.locaties = ELLLocationfloor_4;
      }
    } else {
      if (event.value === '-1') {
        this.locaties = NOOLocationfloorMin_1;
      } else if (event.value === '0') {
        this.locaties = NOOLocationfloor_0;
      } else if (event.value === '1') {
        this.locaties = NOOLocationfloor_1;
      } else if (event.value === '2') {
        this.locaties = NOOLocationfloor_2;
      } else if (event.value === '3') {
        this.locaties = NOOLocationfloor_3;
      } else if (event.value === '4') {
        this.locaties = NOOLocationfloor_4;
      } else if (event.value === '5') {
        this.locaties = NOOLocationfloor_5;
      }
    }
    if (event.value !== 'ALL') {
      this.filterdReports = this.reports.filter(
        (x) => x.floor === event.value && x.campus === this.selectedCampus
      );
      this.filterdReportsByFloor = this.filterdReports;
    } else {
      this.filterdReports = this.filterdReportsByCampus;
    }
  }

  /**
   * This method checks which location is selected
   * @param event this is the selected location
   * @returns a list of all reports based on the selected location
   */
  onLocatieChange(event) {
    // tslint:disable-next-line: max-line-length
    if (event.value !== 'ALL') {
      this.filterdReports = this.reports.filter(
        (x) => x.location === event.value
      );
      this.filterdReportsByLocation = this.filterdReports;
    } else {
      this.filterdReports = this.filterdReportsByFloor;
    }
  }

  /**
   * This method navigates to the previous route/page
   */
  goBack() {
    this.location.back();
  }
}
