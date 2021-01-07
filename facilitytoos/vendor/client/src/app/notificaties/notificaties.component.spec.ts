import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NotificatiesComponent } from './notificaties.component';

describe('NotificatiesComponent', () => {
  let component: NotificatiesComponent;
  let fixture: ComponentFixture<NotificatiesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NotificatiesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NotificatiesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
