import { async, ComponentFixture, TestBed, inject } from '@angular/core/testing';

import { OverzichtComponent } from './overzicht.component';
import { AuthService } from '../auth-service/auth.service';
import { ReportService } from '../services/report.service';
import { DefectMeldenComponent } from '../defect-melden/defect-melden.component';
import { Report } from '../models/Report';
import { of } from 'rxjs';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ToastrModule } from 'ngx-toastr';
import { HttpClientModule } from '@angular/common/http';
import { MatButtonModule, MatToolbarModule, MatSidenavModule, MatIconModule, MatListModule, MatPaginatorModule, MatGridListModule, MatInputModule, MatTableModule, MatCheckboxModule, MatCardModule, MatSelectModule, MatTable, MatTabsModule } from '@angular/material';
import { MatTableFilter, MatTableFilterDirective } from "mat-table-filter";
describe('OverzichtComponent', () => {
  let component: OverzichtComponent;
  let fixture: ComponentFixture<OverzichtComponent>;
  let reportService;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OverzichtComponent ],
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
        MatSelectModule,
        MatTabsModule,
        MatTableFilter,
        AuthService,
        MatTableFilterDirective
        ],
        providers:[ AuthService]
    })
    .compileComponents();
  }));

  beforeEach(inject([ReportService, AuthService], s => {
    reportService = s;
    fixture = TestBed.createComponent(OverzichtComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should call getAllReports that assigned to logged in user and return list of Reports', async(() => {
    const response: Report[] = [];

    spyOn(reportService, 'getAssignToMeReports').and.returnValue(of(response));

    component.ngOnInit();

    fixture.detectChanges();

    expect(component.reports).toEqual(response);
  }));
});
