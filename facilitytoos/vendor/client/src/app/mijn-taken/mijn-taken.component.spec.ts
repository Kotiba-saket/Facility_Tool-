import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MijnTakenComponent } from './mijn-taken.component';

describe('MijnTakenComponent', () => {
  let component: MijnTakenComponent;
  let fixture: ComponentFixture<MijnTakenComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MijnTakenComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MijnTakenComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });


});
