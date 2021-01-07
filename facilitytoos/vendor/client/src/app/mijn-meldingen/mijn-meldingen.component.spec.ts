import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MijnMeldingenComponent } from './mijn-meldingen.component';

describe('MijnMeldingenComponent', () => {
  let component: MijnMeldingenComponent;
  let fixture: ComponentFixture<MijnMeldingenComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MijnMeldingenComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MijnMeldingenComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });


});
