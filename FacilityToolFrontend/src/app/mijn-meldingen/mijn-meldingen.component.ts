import { AuthService } from 'src/app/auth-service/auth.service';
import { ExportService } from './../services/export.service';
import { Component, OnInit, ViewChild, HostListener } from '@angular/core';
import { Report } from '../models/Report';
import { MatTableFilter } from 'mat-table-filter';
import {
  MatPaginator,
  MatTableDataSource,
  MatTabChangeEvent,
} from '@angular/material';
import { ReportService } from '../services/report.service';

@Component({
  selector: 'app-mijn-meldingen',
  templateUrl: './mijn-meldingen.component.html',
  styleUrls: ['./mijn-meldingen.component.css'],
})
export class MijnMeldingenComponent implements OnInit {
  constructor(
    private reportService: ReportService,
    private exportService: ExportService,
    public authService: AuthService
  ) {}
  displayedColumns: string[] = [
    'title',
    'category',
    'campus',
    'location',
    'status',
    'priority',
    'upVote',
    'detail',
  ];
  columnsToSort = [
    { value: 'title', viewValue: 'Defect' },
    { value: 'category', viewValue: 'Categorie' },
    { value: 'campus', viewValue: 'Campus' },
    { value: 'location', viewValue: 'Lokaal' },
    { value: 'status', viewValue: 'Status' },
    { value: 'upVote', viewValue: 'Stemmen' },
  ];
  dataSource = new MatTableDataSource<any>([]);
  dataSource2 = new MatTableDataSource<any>([]);
  dataSource3 = new MatTableDataSource<any>([]);
  newInnerHeight;
  newInnerWidth;
  reports: any;
  filteredArray = [];
  searchText;
  filterEntity: Report;
  filterType: MatTableFilter;
  @ViewChild(MatPaginator, { static: false }) paginator: MatPaginator;
  @ViewChild('paginator2', { static: false }) paginator2: MatPaginator;
  @ViewChild('paginator3', { static: false }) paginator3: MatPaginator;
  @ViewChild('tabGroup', { static: true }) tabGroup;
  @ViewChild('tabGroup2', { static: true }) tabGroup2;
  retrieveResonse: any;
  base64Data: any;
  retrievedImage: string;
  isReportLoaded: boolean;
  isSubLoaded: boolean;
  disableTextbox = false;
  isMyDefectenLoaded: boolean;
  reportsAssign = [];
  reportsSub = [];
  exportedArray: any = [];
  public direction = 'desc'; // asc desc
  public sortBy = 'title';

  /**
   * This method passes logic depending on the size of the screen
   * @param event this holds the width of the current page
   */
  @HostListener('window:resize', ['$event'])
  onResize(event) {
    this.newInnerHeight = event.target.innerHeight;
    this.newInnerWidth = event.target.innerWidth;
  }

  /**
   * This method applies filter functionality on the table
   * @param event this filter value
   */
  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
    // this.repots.filter = filterValue.trim().toLowerCase();
  }

  ngOnInit() {
    this.newInnerWidth = window.innerWidth;

    this.getMyReports();
    this.filterEntity = new Report();
    this.filterType = MatTableFilter.ANYWHERE;

    const index = localStorage.getItem('userTabLocation') || 0; // get stored number or zero if there is nothing stored
    const indexNr = +index;
    this.tabGroup.selectedIndex = indexNr; // with tabGroup being the MatTabGroup accessed through ViewChild
    this.tabGroup2.selectedIndex = indexNr;

    this.getAssignToMeReports();
    this.getSubscribedReports();
  }

  /**
   * This method gives a specific color to priority based on the number of upvotes
   * @param priority The priority/number of votes is given as parameter to determine
   * the color to be given
   */
  setPriorityColor(priority): string {
    if (priority >= 0 && priority < 5) {
      return '#28a745'; // Green
    } else if (priority < 11) {
      return '#ffa500'; // Orange
    } else {
      return '#af0412'; // Red
    }
  }

  /**
   * This method fetches all reports the current user has made from the reports collection
   * The data is stored inside the 'dataSource object and used as the source data fot the table
   * The data is also stored in the 'reports' array variable
   */
  getMyReports() {
    const userId = localStorage.getItem('UserID');
    this.reportService.getMyReports(userId).subscribe((res: any) => {
      if (res !== null && res.length > 0) {
        this.dataSource = new MatTableDataSource<Report>(res);
        this.dataSource.paginator = this.paginator;
        this.reports = res;
        this.isReportLoaded = true;
      } else {
        this.isReportLoaded = false;
      }
    });
  }

  /**
   * This methods saves the currently selected tab to the localstorage
   * This helps to keep that tab active even after restart
   * @param event This is the change process
   */
  handleMatTabChange(event: MatTabChangeEvent) {
    localStorage.setItem('userTabLocation', event.index.toString());
  }

  /**
   * This method disable input fields
   */
  toggleDisable() {
    this.disableTextbox = !this.disableTextbox;
  }

  /**
   * This method fetches all reports assigned to the logged in user
   * The fetched data is stored in the reportsAssign array and also used
   * as the datasource for the table
   */
  getAssignToMeReports() {
    this.reportService.getAssignToMeReports().subscribe((res: any) => {
      if (res !== null && res.length > 0) {
        this.dataSource2 = new MatTableDataSource<Report>(res);
        this.dataSource2.paginator = this.paginator2;
        this.reportsAssign = res;
        this.isMyDefectenLoaded = true;
      } else {
        this.isMyDefectenLoaded = false;
      }
    });
  }

  /**
   * This method fetches all reports the logged in user has subscribed to
   * The fetched data is stored in the 'reportSub' array
   */
  getSubscribedReports() {
    this.reportService.getSubscribedReports().subscribe((res: any) => {
      if (res !== null && res.length > 0) {
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
   * This method exports the content of the table as an ecxel file
   */
  exportTable() {
    this.exportService.ExportData(this.dataSource2, 'To Do', 'Defecten To Do');
  }

  /**
   * This method sorts out the content of the table in ascending or descending order
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
}
