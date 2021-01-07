import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateExternalFirmDialogComponent } from './create-external-firm-dialog.component';

describe('CreateExternalFirmDialogComponent', () => {
  let component: CreateExternalFirmDialogComponent;
  let fixture: ComponentFixture<CreateExternalFirmDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CreateExternalFirmDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateExternalFirmDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
