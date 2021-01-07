
import { async, ComponentFixture, TestBed, inject } from '@angular/core/testing';

import { DefectMeldenComponent } from './defect-melden.component';
import { ReportService } from '../services/report.service';
import { of } from 'rxjs';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ToastrModule } from 'ngx-toastr';
import { HttpClientModule } from '@angular/common/http';
import { MatTableModule, MatButtonModule, MatToolbarModule, MatSidenavModule, MatIconModule, MatListModule, MatPaginatorModule, MatGridListModule, MatInputModule, MatCheckboxModule, MatCardModule, MatSelectModule } from '@angular/material';
import { Report } from '../models/Report';
import { AuthService } from '../auth-service/auth.service';
import { MatTableFilterDirective, MatTableFilter } from 'mat-table-filter';
describe('DefectMeldenComponent', () => {
  let component: DefectMeldenComponent;
  let fixture: ComponentFixture<DefectMeldenComponent>;
  let reportService;
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DefectMeldenComponent ],
      imports:[ FormsModule,
        ReactiveFormsModule,
        ToastrModule.forRoot(),
        HttpClientModule,
         MatButtonModule,
        MatToolbarModule,
        MatSidenavModule,
        MatIconModule,
        MatListModule,
        MatPaginatorModule,
        MatGridListModule,
        MatInputModule,
        MatTableModule,
        MatCheckboxModule,
        MatGridListModule,
        MatCardModule,
        MatSelectModule,,]
    })
    .compileComponents();
  }));

  beforeEach(inject([ReportService], s => {
    fixture = TestBed.createComponent(DefectMeldenComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));



  // it('should call getAllReports and return list of Reports', async(() => {
  //   const response: Report[] = [];

  //   spyOn(reportService, 'getAllReports').and.returnValue(of(response))

  //   component.ngOnInit();

  //   fixture.detectChanges();

  //   expect(component.reports).toEqual(response);
  // }));
});

