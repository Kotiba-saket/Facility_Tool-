import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NoodgevalComponent } from './noodgeval.component';

describe('NoodgevalComponent', () => {
  let component: NoodgevalComponent;
  let fixture: ComponentFixture<NoodgevalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NoodgevalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NoodgevalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });


});
