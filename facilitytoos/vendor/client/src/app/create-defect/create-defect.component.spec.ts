import { Router } from '@angular/router';
import { async, ComponentFixture, TestBed, inject } from '@angular/core/testing';
import { CreateDefectComponent } from './create-defect.component';
import { ReportService } from '../services/report.service';
import { of } from 'rxjs';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { ToastrModule } from 'ngx-toastr';
import { RouterTestingModule } from '@angular/router/testing';

describe('CreateDefectComponent', () => {
  let component: CreateDefectComponent;
  let fixture: ComponentFixture<CreateDefectComponent>;
  let reportService;
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CreateDefectComponent ],
      imports:[ FormsModule,
        ReactiveFormsModule,
        ToastrModule.forRoot(),
        HttpClientModule,RouterTestingModule
      ]


    })
    .compileComponents();
  }));

  beforeEach(inject([ReportService, Router], s => {
    reportService = s;
    fixture = TestBed.createComponent(CreateDefectComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  /**
   * check als getAllCategorie werkt
   * Added By Kotiba
   */
  it('should call getCategory and return list of Category', async(() => {
    const response: string[] = [];

    spyOn(reportService, 'getAllCategorie').and.returnValue(of(response))

    component.ngOnInit();

    fixture.detectChanges();

    expect(component.Categories).toEqual(response);
  }));
});



// String data = "{\n" +
// "\t\"title\": \"test title\",\n" +
// "\t\"description\":\"test des\",\n" +
// "\t\"location\": \"test location\",\n" +
// "\t\"campus\":\"ELL\",\n" +
// "\t\"status\":\"OPEN\",\n" +
// "\t\"priority\":\"LOW\",\n" +
// "\t\"category\": \"test cate\"\n" +
// "}";
// MockMultipartFile firstFile = new MockMultipartFile("data", "filename.txt", "text/plain", "some xml".getBytes());
