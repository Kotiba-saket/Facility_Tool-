import { async, ComponentFixture, TestBed, inject } from '@angular/core/testing';
import { OrderService } from '../services/create-task-service/order.service';
import { Order, Campus, Status } from '../models/Order';

import {MatTableDataSource} from '@angular/material/table';
import {HttpClientTestingModule, HttpTestingController} from '@angular/common/http/testing';

import { TaskMeldenComponent } from './task-melden.component';

describe('TaskMeldenComponent', () => {
  let component: TaskMeldenComponent;
  let fixture: ComponentFixture<TaskMeldenComponent>;

  let orderService: OrderService;
  let httpMock: HttpTestingController;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [TaskMeldenComponent],
      imports: [HttpClientTestingModule, MatTableDataSource],
      providers: [OrderService],
    }).compileComponents();

    orderService = TestBed.get(OrderService);
    httpMock = TestBed.get(HttpTestingController);
  }));

  // beforeEach(() => {
  //   fixture = TestBed.createComponent(TaskMeldenComponent);
  //   component = fixture.componentInstance;
  //   fixture.detectChanges();
  // });

  it(`it should create and fetch orders`, async(
    inject(
      [HttpTestingController, OrderService],
      // tslint:disable-next-line: no-shadowed-variable
      (httpClient: HttpTestingController, orderService: OrderService) => {
        const postItem = [
          {
            id: 1,
            title: 'Lezen over DevOps',
            campus: 'ELL',
            location: '05.02',
            description: 'We hebben 14 drankjes nodig',
            date: '2020-04-30',
            time: '09:30',
            status: 'OPEN',
          },
          {
            id: 2,
            title: 'Broodjes bestellen',
            campus: 'ELL',
            location: '01.08',
            description: 'We willen 20 botterhammen en 12 cola drankjes.  A.U.B. je moet op tijd',
            date: '2020-04-30',
            time: '14:00',
            status: 'OPEN',
          },
          {
            id: 3,
            title: 'Drankjes bestellen',
            campus: 'ELL',
            location: '01.08',
            description: 'We willen 12 cola dranjes.',
            date: '2020-04-30',
            time: '14:00',
            status: 'OPEN',
          },
        ];

        orderService.getOrders().subscribe((orders: any) => {
          expect(orders.length).toBe(3);
        });

        let req = httpMock.expectOne('http://localhost:8080/api/orders');
        expect(req.request.method).toBe('GET');

        req.flush(postItem);
        httpMock.verify();
      }
    )
  ));

});
