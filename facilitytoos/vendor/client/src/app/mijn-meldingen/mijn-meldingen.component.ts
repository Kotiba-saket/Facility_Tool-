import { AuthService } from 'src/app/auth-service/auth.service';
import { ExportService } from './../services/export.service';
import { Component, OnInit, ViewChild, HostListener } from '@angular/core';
import { Report } from '../models/Report';
import { MatTableFilter } from 'mat-table-filter';
import { MatPaginator, MatTableDataSource, MatTabChangeEvent } from '@angular/material';
import { ReportService } from '../services/report.service';
import { SelectionModel } from '@angular/cdk/collections';
import { PeriodicElement } from '../task-melden/task-melden.component';
import * as XLSX from 'xlsx';
@Component({
  selector: 'app-mijn-meldingen',
  templateUrl: './mijn-meldingen.component.html',
  styleUrls: ['./mijn-meldingen.component.css']
})
export class MijnMeldingenComponent implements OnInit {
  constructor( private reportService: ReportService,private exportService: ExportService, public authService: AuthService) { }
  displayedColumns: string[] = [
    'title',
    'category',
    'campus',
    'location',
    'status',
    'priority',
    'upVote',
    'detail'
  ];
  columnsToSort = [
    {value: 'title', viewValue: 'title'},
    {value: 'category', viewValue: 'category'},
    {value: 'campus', viewValue: 'campus'},
    {value: 'location', viewValue: 'location'},
    {value: 'status', viewValue: 'status'},
    {value: 'upVote', viewValue: 'upVote'}
   ]
  dataSource = new MatTableDataSource<any>([]);
  dataSource2 = new MatTableDataSource<any>([]);
  dataSource3 = new MatTableDataSource<any>([]);
  newInnerHeight;
  newInnerWidth ;
  reports: any;
  filteredArray = [];
  searchText;
  filterEntity: Report;
  filterType: MatTableFilter;
  @ViewChild(MatPaginator, {static: false}) paginator: MatPaginator;
  @ViewChild('paginator2', { static: false }) paginator2: MatPaginator;
  @ViewChild('paginator3', { static: false }) paginator3: MatPaginator;
  @ViewChild('tabGroup', { static: true }) tabGroup;
  @ViewChild('tabGroup2', { static: true }) tabGroup2;
  retrieveResonse: any;
  base64Data: any;
  retrievedImage: string;
  isReportLoaded:Boolean;
  isSubLoaded:Boolean;
  disableTextbox =  false;
  isMyDefectenLoaded: Boolean;
  reportsAssign = [];
  reportsSub = [];
  exportedArray: any = [];
  public direction = 'desc'; //asc desc
  public sortBy = "title"
  @HostListener('window:resize', ['$event'])
  onResize(event) {
    this.newInnerHeight = event.target.innerHeight;
    this.newInnerWidth = event.target.innerWidth;
    console.log(this.newInnerWidth);
  }
  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
    //this.repots.filter = filterValue.trim().toLowerCase();
  }


  ngOnInit() {
    this.newInnerWidth = window.innerWidth;

    this.getMyReports();
    this.filterEntity = new Report();
    this.filterType = MatTableFilter.ANYWHERE;


    let index = localStorage.getItem('userTabLocation') || 0; // get stored number or zero if there is nothing stored
    let indexNr = +index;
    this.tabGroup.selectedIndex = indexNr; // with tabGroup being the MatTabGroup accessed through ViewChild
    this.tabGroup2.selectedIndex = indexNr;

    this.getAssignToMeReports();
    this.getSubscribedReports();
  }



  ngOnDestroy () {
    let index = localStorage.removeItem('userTabLocation');

}

    /**
   * deze functie check eerst wat is de prioriteit en dan maakt Background Color
   * @param priority check if priority HIGH OF MEDIUM OF LOW
   */
  setPriorityColor(priority): String
  {
    switch (priority) {
        case 'HIGH':
          return '#af0412'; // Red
        case 'NORMAL':
          return '#ffa500'; // Orange
        case 'LOW':
          return '#28a745'; // Green
    }
  }

  getMyReports(){
    const userId = localStorage.getItem("UserID")
    this.reportService.getMyReports(userId).subscribe(res => {

      if(res !== null && res.length > 0) {
        this.dataSource = new MatTableDataSource<Report>(res);
        this.dataSource.paginator = this.paginator;
        this.reports = res;
        this.isReportLoaded = true;
      } else {
        this.isReportLoaded = false;
      }

  })
}
handleMatTabChange(event: MatTabChangeEvent ) {
  localStorage.setItem('userTabLocation', event.index.toString());
  console.log(event.index);
}


toggleDisable() {
  this.disableTextbox = !this.disableTextbox;
}


  /**
   * get alle taken die aan een bapaalde gebruiker toegewijzen worden
   */
  getAssignToMeReports() {
    this.reportService.getAssignToMeReports().subscribe((res) => {

      if(res !== null && res.length > 0) {
        this.dataSource2 = new MatTableDataSource<Report>(res);
        this.dataSource2.paginator = this.paginator2;
        this.reportsAssign = res;
        this.isMyDefectenLoaded = true;
      } else {
        this.isMyDefectenLoaded = false;
      }

    });
  }

  getSubscribedReports(){
    this.reportService.getSubscribedReports().subscribe((res) => {
      if(res !== null && res.length > 0) {
        this.dataSource3 = new MatTableDataSource<Report>(res);
        this.dataSource3.paginator = this.paginator3;
        this.reportsSub = res;
        this.isSubLoaded = true;
      } else {
        this.isSubLoaded = false;
      }
    });
  }

    /**
   * deze function export data rows naar Excel bestand
   * export ook volgens search criteria
   */

  exportTable() {
    this.exportService.ExportData(this.dataSource2,"To Do", "Defecten To Do");

  }

  SortBy(){
    //asc desc
    switch(this.direction){
      case  'asc':
         return this.direction = 'desc';
      case 'desc':
        return this.direction = 'asc';
      default:
        return this.direction = 'desc';
    }

  }
}
