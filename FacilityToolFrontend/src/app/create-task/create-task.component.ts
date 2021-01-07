import { Component, OnInit } from '@angular/core';
import { OrderService } from '../services/create-task-service/order.service';
import { Order, Campus, Status } from '../models/Order';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
import { CategoryService } from '../services/category.service';
import { Location } from '@angular/common';
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

@Component({
  selector: 'app-create-task',
  templateUrl: './create-task.component.html',
  styleUrls: ['./create-task.component.css'],
})
export class CreateTaskComponent implements OnInit {
  departments = ['Logistieke diensten'];
  selected = 'option2';
  campusen = Campus;
  selectedCampus: string;
  public campusenOption = [];
  public order: Order = new Order();
  categories: string[] = [];
  public userId = localStorage.getItem('UserID');
  public userName = localStorage.getItem('UserName');
  public floors: string[];
  public locaties: string[];

  constructor(
    private os: OrderService,
    private toastr: ToastrService,
    private router: Router,
    private categoryService: CategoryService,
    private location: Location
  ) {}

  ngOnInit() {
    this.campusenOption = Object.keys(this.campusen);
  }

  /**
   * This change event set the target to the currently selected campus from the dropdown
   * @param campus this is the selected campus
   */
  onChange(campus) {
    this.selectedCampus = campus;
  }

  /**
   * This method is responsible for creating a new order.
   * It needs the order body and the requester information
   * After a succesful add, the user will be redirected to the homepage
   */
  createOrder() {
    this.order.status = Status.OPEN;
    const title = this.order.title.replace(/ {2,}/g, ' ').trim();
    const describtion = this.order.description.replace(/ {2,}/g, ' ').trim();
    this.order.title = title;
    this.order.description = describtion;
    this.os.createOrder(this.order, this.userName, this.userId).subscribe(
      (res) => {
        this.toastr.success('Bedankt !', 'Taak wordt toegevoegd');
        this.router.navigate(['/']);
      },
      (error) => {
        this.toastr.error('Er is een Error');
      }
    );
  }

  /**
   * This method in some way serves as a filter on the categories.
   * When a department is selected, a list of categories based on the selected
   * department is fetched from the database
   */
  onDepartmentChange(e) {
    const department = e.target.value;
    this.categoryService.getCategoriesBydepartment(department).subscribe(
      (res) => {
        this.categories = res[0].categories;
      },
      (error) => {
        console.log(error);
      }
    );
  }

  /**
   * This method navigates to the previous route/page
   */
  goBack() {
    this.location.back();
  }

  /**
   * This method checks which campus is selected
   * @param event this is the selected campus
   * @returns a list of all the floors based on the selected campus
   */
  onCampusChange(event) {
    if (event.target.value === 'ELL') {
      this.floors = ELLfloor;
      this.selectedCampus = 'ELL';
    } else {
      this.floors = NOOfloor;
      this.selectedCampus = 'NOO';
    }
  }

  /**
   * This method checks which floor is selected
   * @param event this is the selected floor
   * @returns a list of all rooms based on the selected floor
   */
  onEtageChange(event) {
    if (this.selectedCampus === 'ELL') {
      if (event.target.value === '-1') {
        this.locaties = ELLLocationfloorMin_1;
      } else if (event.target.value === '0') {
        this.locaties = ELLLocationfloor_0;
      } else if (event.target.value === '1') {
        this.locaties = ELLLocationfloor_1;
      } else if (event.target.value === '2') {
        this.locaties = ELLLocationfloor_2;
      } else if (event.target.value === '3') {
        this.locaties = ELLLocationfloor_3;
      } else if (event.target.value === '4') {
        this.locaties = ELLLocationfloor_4;
      }
    } else {
      if (event.target.value === '-1') {
        this.locaties = NOOLocationfloorMin_1;
      } else if (event.target.value === '0') {
        this.locaties = NOOLocationfloor_0;
      } else if (event.target.value === '1') {
        this.locaties = NOOLocationfloor_1;
      } else if (event.target.value === '2') {
        this.locaties = NOOLocationfloor_2;
      } else if (event.target.value === '3') {
        this.locaties = NOOLocationfloor_3;
      } else if (event.target.value === '4') {
        this.locaties = NOOLocationfloor_4;
      } else if (event.target.value === '5') {
        this.locaties = NOOLocationfloor_5;
      }
    }
  }
}
