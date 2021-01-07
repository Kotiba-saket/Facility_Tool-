import { ExportService } from './../services/export.service';
import { Component, OnInit, ViewChild, HostListener, ViewChildren, QueryList, OnDestroy } from '@angular/core';
import {MatTableDataSource} from '@angular/material/table';
import { MatPaginator } from '@angular/material';
import { ReportService } from '../services/report.service';
import { Report } from '../models/Report';
import { OrderService } from '../services/create-task-service/order.service';
import { Order } from '../models/Order';
import { MatTableFilter } from 'mat-table-filter';
import {MatTabsModule, MatTabChangeEvent} from '@angular/material/tabs';

@Component({
  selector: 'app-admin-view',
  templateUrl: './admin-view.component.html',
  styleUrls: ['./admin-view.component.css']
})
export class AdminViewComponent implements OnInit , OnDestroy{
  displayedDefectColumns: string[] = ['title', 'category', 'campus', 'location', 'status', 'priority'];
  displayedTaskColumns: string[] = ['title', 'campus', 'location', 'date', 'time', 'status', 'detail'];
  columnsToSort = [
    {value: 'title', viewValue: 'title'},
    {value: 'category', viewValue: 'category'},
    {value: 'campus', viewValue: 'campus'},
    {value: 'location', viewValue: 'location'},
    {value: 'status', viewValue: 'status'},
    {value: 'upVote', viewValue: 'upVote'}
   ];
   TaskscolumnsToSort = [
    {value: 'title', viewValue: 'title'},
    {value: 'date', viewValue: 'date'},
    {value: 'campus', viewValue: 'campus'},
    {value: 'location', viewValue: 'location'},
    {value: 'status', viewValue: 'status'},
   ];

  defectDataSource;
  taskDataSource;
  newInnerHeight;
  newInnerWidth ;
  reports: any;
  orders: any;
  filteredArray = [];
  searchText;
  defectFilterEntity: Report;
  taskFilterEntity: Order;
  filterType: MatTableFilter;
  public TasksortBy = "title"
  // @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;
  @ViewChild('defectPaginator', {static: true}) defectPaginator: MatPaginator;
  @ViewChild('taskPaginator', {static: true}) taskPaginator: MatPaginator;
  @ViewChild('tabGroup', { static: true }) tabGroup;
  @ViewChild('tabGroup2', { static: true }) tabGroup2;
  retrieveResonse: any;
  base64Data: any;
  retrievedImage: string;
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
    this.defectDataSource.filter = filterValue.trim().toLowerCase();
  }

  constructor( private reportService: ReportService, private orderService: OrderService,private exportService: ExportService) { }

  ngOnInit() {

    this.getAllReports();
    this.newInnerWidth = window.innerWidth;

    /**
     * Dit gaat via de backend de data ophalen en plaatsen in onze DataSource
     */
    this.reportService.getReports().subscribe((data) => {
      this.defectDataSource = new MatTableDataSource<Report>(data);
      this.defectDataSource.paginator = this.defectPaginator;
      this.reports = data;
      console.log(data);
    });


    this.orderService.getOrders().subscribe(res => {
      this.taskDataSource = new MatTableDataSource<Order>(res);
      // this.orders = new MatTableDataSource<(Order)>(res);
      this.taskDataSource.paginator = this.taskPaginator;
      this.orders = res;
      console.log(res);
    });

    /**
     * We gebruiken deze attributen om onze filter entity en type te definiëren deze hebben we nodig om te kunnen zoeken
     * op elke attribuut binnen ons Report model
     */
    this.taskFilterEntity = new Order();
    this.defectFilterEntity = new Report();
    this.filterType = MatTableFilter.ANYWHERE;

    let index = localStorage.getItem('userTabLocation') || 0; // get stored number or zero if there is nothing stored
    let indexNr = +index;
    this.tabGroup.selectedIndex = indexNr; // with tabGroup being the MatTabGroup accessed through ViewChild
    this.tabGroup2.selectedIndex = indexNr;

  }



  /**
   * deze functie check eerst wat is de prioriteit en dan maakt Background Color
   * @param priority checkt als priority HIGH OF MEDIUM OF LOW
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

  /**
   * deze function call backend function om alle reports vanuit
   * database te halen
   */
    getAllReports(){
      this.reportService.getReports().subscribe(res => {
        this.defectDataSource = new MatTableDataSource<Report>(res);
        //this.repots = new MatTableDataSource<Report>(data);
        this.defectDataSource.paginator = this.defectPaginator;
      this.reports = res;
    })
  }


exportDefecten(){
this.exportService.ExportData(this.defectDataSource,"Defecten List","Defecten");
}
exportTaken(){
  this.exportService.ExportData(this.taskDataSource, "Taken list","Taken");
}

handleMatTabChange(event: MatTabChangeEvent ) {
  localStorage.setItem('userTabLocation', event.index.toString());
  console.log(event.index);
}

ngOnDestroy () {
  let index = localStorage.removeItem('userTabLocation');

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
