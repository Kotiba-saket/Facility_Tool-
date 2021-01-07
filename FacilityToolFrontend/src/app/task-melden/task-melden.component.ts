import { Component, OnInit, ViewChild, HostListener } from '@angular/core';
import {MatTableDataSource} from '@angular/material/table';
import { MatPaginator } from '@angular/material';
import { OrderService } from '../services/create-task-service/order.service';
import { Order } from '../models/Order';
import { MatTableFilter } from 'mat-table-filter';

@Component({
  selector: 'app-task-melden',
  templateUrl: './task-melden.component.html',
  styleUrls: ['./task-melden.component.css']
})
export class TaskMeldenComponent implements OnInit {
  displayedColumns: string[] = ['title', 'category', 'campus', 'location', 'date', 'time', 'status', 'detail'];

  filterEntity: Order;
  filterType: MatTableFilter;
  dataSource;
  newInnerHeight;
  newInnerWidth ;
  orders: any;
  filteredArray = [];
  searchText;
  @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;
  retrieveResonse: any;
  base64Data: any;
  retrievedImage: string;
  @HostListener('window:resize', ['$event'])

  /**
   * This method passes logic depending on the size of the screen
   * @param event this holds the width of the current page
   */
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
    // this.orders.filter = filterValue.trim().toLowerCase();
  }
  constructor( private orderService: OrderService) { }

  /**
   * The ngOnInit method contains all functions and properties that runs automatically at startup
   * Immediately navigation is made to this component, the functions and properties are calle
   * automatically
   */
  ngOnInit() {
    this.orderService.getOrders().subscribe((res: any) => {
      this.dataSource = new MatTableDataSource<Order>(res);
      // this.orders = new MatTableDataSource<(Order)>(res);
      this.dataSource.paginator = this.paginator;
      this.orders = res;
    });


    this.filterEntity = new Order();
    this.filterType = MatTableFilter.ANYWHERE;

    this.newInnerWidth = window.innerWidth;
  }


}
