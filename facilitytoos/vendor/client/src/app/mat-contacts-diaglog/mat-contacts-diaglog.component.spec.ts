import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MatContactsDiaglogComponent } from './mat-contacts-diaglog.component';

describe('MatContactsDiaglogComponent', () => {
  let component: MatContactsDiaglogComponent;
  let fixture: ComponentFixture<MatContactsDiaglogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MatContactsDiaglogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MatContactsDiaglogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
