import { AuthService } from 'src/app/auth-service/auth.service';
import { Component, OnInit, ViewChild, HostListener } from '@angular/core';
import { Order } from '../models/Order';
import { MatTableFilter } from 'mat-table-filter';
import {
  MatPaginator,
  MatTableDataSource,
  MatSort,
  MatTabChangeEvent,
} from '@angular/material';
import { OrderService } from '../services/create-task-service/order.service';

@Component({
  selector: 'app-mijn-taken',
  templateUrl: './mijn-taken.component.html',
  styleUrls: ['./mijn-taken.component.css'],
})
export class MijnTakenComponent implements OnInit {
  constructor(
    private orderService: OrderService,
    public authService: AuthService
  ) {}
  displayedColumns: string[] = [
    'title',
    'category',
    'campus',
    'location',
    'date',
    'time',
    'status',
    'detail',
  ];
  TaskscolumnsToSort = [
    { value: 'title', viewValue: 'Taak' },
    { value: 'category', viewValue: 'Categorie' },
    { value: 'date', viewValue: 'Datum' },
    { value: 'campus', viewValue: 'Campus' },
    { value: 'location', viewValue: 'Lokaal' },
    { value: 'status', viewValue: 'Status' },
  ];

  GroupNames: any;
  returnValue: boolean;
  dataSource = new MatTableDataSource<any>([]);
  dataSource2 = new MatTableDataSource<any>([]);
  newInnerHeight;
  newInnerWidth;
  orders: any;
  filteredArray = [];
  searchText;
  filterEntity: Order;
  filterType: MatTableFilter;
  @ViewChild(MatPaginator, { static: false }) paginator: MatPaginator;
  @ViewChild('paginator2', { static: false }) paginator2: MatPaginator;
  @ViewChild('tabGroup', { static: true }) tabGroup;
  @ViewChild('tabGroup2', { static: true }) tabGroup2;
  @ViewChild(MatSort, { static: true }) sort: MatSort;
  retrieveResonse: any;
  base64Data: any;
  isOrderLoaded: boolean;
  isMyTakenLoaded: boolean;
  ordersAssign = [];

  public TasksortBy = 'title';
  public direction = 'desc';

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
  }

  ngOnInit() {
    this.newInnerWidth = window.innerWidth;

    this.getMyOrders();
    this.filterEntity = new Order();
    this.filterType = MatTableFilter.ANYWHERE;
    this.dataSource.sort = this.sort;
    this.getAssignToMeOrders();
    const index = localStorage.getItem('userTabLocation') || 0; // get stored number or zero if there is nothing stored
    const indexNr = +index;
    this.tabGroup.selectedIndex = indexNr; // with tabGroup being the MatTabGroup accessed through ViewChild
    this.tabGroup2.selectedIndex = indexNr;
  }

  /**
   * This method fetches all orders the current user has made from the orders collection
   * The data is stored inside the 'dataSource object and used as the source data fot the table
   * The data is also stored in the 'orders' array variable
   */
  getMyOrders() {
    const userId = localStorage.getItem('UserID');
    this.orderService.getMyOrders(userId).subscribe((res: any) => {
      if (res !== null && res.length > 0) {
        this.dataSource = new MatTableDataSource<Order>(res);
        this.dataSource.paginator = this.paginator;
        this.orders = res;
        this.isOrderLoaded = true;
      } else {
        this.isOrderLoaded = false;
      }
    });
  }

  /**
   * This method fetches all orders assigned to the logged in user
   * The fetched data is stored in the ordersAssign array and also used
   * as the datasource for the table
   */
  getAssignToMeOrders() {
    this.orderService.getOrdersAssignToMe().subscribe((res: any) => {
      if (res !== null && res.length > 0) {
        this.dataSource2 = new MatTableDataSource<Order>(res);
        this.dataSource2.paginator = this.paginator2;
        this.ordersAssign = res;
        this.isMyTakenLoaded = true;
      } else {
        this.isMyTakenLoaded = false;
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

  /**
   * This method fetches all members of a particular group from the localStorage
   * @param group this is the name of the group
   */
  isMemberOfGroup(group: string) {
    this.GroupNames = localStorage.getItem('GroupNames');
    if (this.GroupNames !== null) {
      const a = this.GroupNames.toString().indexOf(group);

      if (a !== -1) {
        this.returnValue = true;
      }
    }
    return this.returnValue;
  }
}
