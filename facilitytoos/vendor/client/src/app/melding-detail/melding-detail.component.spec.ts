import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MeldingDetailComponent } from './melding-detail.component';

describe('MeldingDetailComponent', () => {
  let component: MeldingDetailComponent;
  let fixture: ComponentFixture<MeldingDetailComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MeldingDetailComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MeldingDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  // it('should create', () => {
  //   expect(component).toBeTruthy();
  // });
});
