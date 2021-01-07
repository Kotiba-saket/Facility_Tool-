import { ArchiveService } from './../services/archive.service';
import { ConfirmDialogService } from './../shared/confirm-dialog.service';


import {
  Component,
  OnInit,
  HostListener,
  ViewEncapsulation,
  ViewChild

} from '@angular/core';
import { ReportService } from '../services/report.service';
import { Report, AzureUser, Campus, Status } from '../models/Report';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../auth-service/auth.service';
import { MatTabChangeEvent, MatTabGroup } from '@angular/material';
import { UpVoteService } from '../services/upvote/up-vote.service';
import { ToastrService } from 'ngx-toastr';
import { Location } from '@angular/common';
import { CategoryService } from '../services/category.service';
import { CompressorService } from '../services/Compressor.service';
import { map, expand } from 'rxjs/operators';
import { EMPTY } from 'rxjs';
import {ELLfloor, NOOfloor, ELLLocationfloorMin_1, ELLLocationfloor_0,
ELLLocationfloor_1, ELLLocationfloor_2, ELLLocationfloor_3, ELLLocationfloor_4,
NOOLocationfloorMin_1, NOOLocationfloor_0, NOOLocationfloor_1,
NOOLocationfloor_2, NOOLocationfloor_3, NOOLocationfloor_4, NOOLocationfloor_5
}from '../models/groundplans';
@Component({
  selector: 'app-melding-detail',
  templateUrl: './melding-detail.component.html',
  styleUrls: ['./melding-detail.component.css'],
})
export class MeldingDetailComponent implements OnInit {
  departments = [
    'Facilitaire diensten',
    'ICT diensten',
    'Herstellingen Didactisch materiaal',
  ];

  groupMemberObject: AzureUser;
  emplyeesList: AzureUser[] = [];
  assignToUserInformation: AzureUser;
  id: string;
  report: Report;
  reporterId: string;
  reportId: string;
  public LogedInUser: string;
  isLoaded: boolean;
  campus = Campus;
  campusesList = [];
  status = Status;
  statusList = [];
  Categories: string[] = [];
  selectedFile: File;
  fileName: string;
  newInnerWidth;
  adjustable = false;
  public isGeaboneerd;
  public selectedIndex;
  UserID = localStorage.getItem('UserID');
  public floors: string[];
  public locaties: string[];
  selectedCampus: string;

  constructor(
    private route: ActivatedRoute,
    private reportService: ReportService,
    public authService: AuthService,
    private toastr: ToastrService,
    private upVoteService: UpVoteService,
    private _location: Location,
    private categoryService: CategoryService,
    private compressor: CompressorService,
    private dialogService: ConfirmDialogService,
    private archiveService: ArchiveService,
    private router: Router
  ) {}

  data: FileList;
  GroupNames: any;
  compressedImages = [];

  ngOnInit() {
    this.reporterId = localStorage.getItem('UserID');
    this.id = this.route.snapshot.paramMap.get('id');
    this.LogedInUser = localStorage.getItem('UserID');
    this.getReport();
    this.getFacilityMedewerkerGroup();
    this.campusesList = Object.keys(this.campus);
    this.newInnerWidth = window.innerWidth;
    this.statusList = Object.values(this.status);
    const index = localStorage.getItem('userTabLocationDetails') || 0; // get stored number or zero if there is nothing stored
    const indexNr = +index;
    this.selectedIndex = indexNr; // with tabGroup being the MatTabGroup accessed through ViewChild
    this.selectedIndex  = indexNr;
    this.getFacilityCoordinatorGroup();
  }

  recursiveCompress = (image: File, index, array) => {
    return this.compressor.compress(image).pipe(
      map((response) => {
        // Code block after completing each compression
        console.log('compressed ' + index + image.name);
        this.compressedImages.push(response);
        return {
          data: response,
          index: index + 1,
          array,
        };
      })
    );
  }

  public process(event) {
    this.data = event.target.files;
    this.fileName = event.target.files[0].name;
    console.log('input: ' + this.data[0]);
    const compress = this.recursiveCompress(this.data[0], 0, this.data).pipe(
      expand((res) => {
        return res.index > res.array.length - 1
          ? EMPTY
          : this.recursiveCompress(this.data[res.index], res.index, this.data);
      })
    );
    compress.subscribe((res) => {
      if (res.index > res.array.length - 1) {
        // Code block after completing all compression
        console.log('Compression successful ' + this.compressedImages);
      }
    });
  }

  @HostListener('window:resize', ['$event'])
  onResize(event) {
    this.newInnerWidth = event.target.innerWidth;
    this.statusList = Object.values(this.status);
  }


   /**
 * krijg je hier alle leden van FacilityMedewerker groep en we lopen de response,
 * dan we voegen alle members id's en displayname in employeesList array
 */
  getFacilityMedewerkerGroup() {
    this.authService.getMembersOfGroup('21ed2689-2847-40f3-8f5a-e136f67dca8b').subscribe(res => {
      res.value.forEach((element) => {
        this.assignToUserInformation = {
          azureUserId: element.id,
          displayName: element.displayName,
        };
        this.emplyeesList.push(this.assignToUserInformation);
    });
  });
  }

    /**
 * krijg je hier alle leden van FacilityCoordinator groep en we lopen de response,
 * dan we voegen alle members id's en displayname in employeesList array
 */
  getFacilityCoordinatorGroup() {
    this.authService.getMembersOfGroup('a49953f2-c570-4ab2-aa0a-e89806db1dde').subscribe(res => {
      res.value.forEach((element) => {
        this.assignToUserInformation = {
          azureUserId: element.id,
          displayName: element.displayName,
        };
        this.emplyeesList.push(this.assignToUserInformation);
    });
  });
  }
  /**
   * als de user een employee geselecteerd heeft van de select opties, dan nemen we hier het id en naam van de geselecteerd employee
   * @param e heeft informatie over de geselecteerde optie
   */
  onChange(e) {
    this.assignToUserInformation = {
      azureUserId: e.target.value,
      displayName: e.target.options[e.target.options.selectedIndex].text,
    };
  }

  /**
   * bij dit methode we call een methode van onze authservice en we pass 3 parameters: de ingelodgd user id, de id van de employee die we willen
   * een report aan hem toewijzen, een de report id, en wordt de report toegewijzen aan de gespecifieerd employee.
   */
  getSelectedAssignedUserInformation() {
    this.reportService
      .assignReportToEmplyee(
        this.assignToUserInformation,
        this.reporterId,
        this.id
      )
      .subscribe(
        (result) => {
          this.toastr.success(
            `defect is succefully toegevoegd aan ${this.assignToUserInformation.displayName}`
          );
        },
        (error) => {
          this.toastr.error('er is een error');
        }
      );
  }

  getReport() {
    this.reportService.getReport(this.id).subscribe((data) => {
      if (data !== null) {
        this.report = data;

        this.getCategoryByDepartment();
        this.getEtageByCampus();
        this.getLocationByCampusAndFloor();
        this.isLoaded = true;
        data.subscribers.forEach((element) => {
          if (element === this.UserID) {
            this.isGeaboneerd = true;
          }
      });
        // this.isGeaboneerd = !this.isGeaboneerd;
      } else {
        this.isLoaded = false;
      }
    });
  }

  updateReport() {
    if (this.report.status === 'Wordt niet uitgevoerd' || this.report.status === 'Voltooid') {
      this.whenReportNotDoneOrDone(this.report.status);
      console.log('test status');
    } else {
      this.reportService
      .updateReport(this.report, this.compressedImages)
      .subscribe(
        (res) => {
          this.toastr.success('De melding werd gewijzigd.', 'Succes!');
          location.reload();
        },
        (error) => {
          this.toastr.error('Er is een fout opgetreden.', 'Error!');
        }
      );
    }


  }

  /**
   *
   * @param priority Returneert de gepaste kleur voor de Priority Button gebaseerd op de prioriteitswaarde.
   */
  setPriorityColor(priority): String {
    switch (priority) {
      case 'HIGH':
        return '#af0412'; // Red
      case 'NORMAL':
        return '#ffa500'; // Orange
      case 'LOW':
        return '#28a745'; // Green
    }
  }

  /**
   * deze function call backend function om Alle  Categorie vanuit database te halen
   *
   */
  getCategoryByDepartment() {
    this.categoryService
      .getCategoriesBydepartment(this.report.categoryDepartment)
      .subscribe(
        (res) => {
          // console.log(res[0].categories);
          this.Categories = res[0].categories;
        },
        (error) => {
          console.log(error);
        }
      );
  }

  onDepartmentChange(e) {
    console.log(e.target.value);
    const department = e.target.value;
    this.categoryService.getCategoriesBydepartment(department).subscribe(
      (res) => {
        // console.log(res[0].categories);
        this.Categories = res[0].categories;
      },
      (error) => {
        console.log(error);
      }
    );
  }

  /**
   * functie zal de UpvoteService aanroepen en een het huidige report object meegeven
   *
   */
  subscription() {
    this.report.subscribers.forEach((element) => {
        if (element === this.UserID) {
          this.isGeaboneerd = true;
        }
    });
    this.isGeaboneerd = !this.isGeaboneerd;

    this.upVoteService.updateUserVote(this.report, this.UserID);
    console.log('is Geaboneerd = ' + this.isGeaboneerd);
  }
  goBack() {
    this._location.back();
  }

  handleMatTabChange(event: MatTabChangeEvent) {
    localStorage.setItem('userTabLocationDetails', event.index.toString());
    console.log(event.index);
  }


  /**
   * deze function annuleert het report en stuurt het naar de archief
   * als de gebruiker accepteert dat
   */

  onCancelReport() {
    this.dialogService.openConfirmDialog('Weet u zeker dat u dit defect wilt annuleren? Deze actie kan niet ongedaan worden gemaakt')
    .afterClosed().subscribe(res => {
      // console.log(res)
      if (res) {
         // Update


         this.report.status = this.status.DISCARDED;
         this.reportService
         .updateReport(this.report, this.compressedImages)
         .subscribe(
           (res) => {
             this.toastr.success('De melding werd gewijzigd.', 'Succes!');
             location.reload();
           }
         );
        // annuleren
         this.moveReportToArchive();
         this.deleteReport();
         this.toastr.success('Het defect word gearchiveerd');
         this.router.navigate(['/']);

      }
    });
  }
    /**
     * defect archiveren wanneer de defect status wordt voltooid of wordt niet uitgevoerd
     * @param status status van defect
     */
  whenReportNotDoneOrDone(status: String) {
    this.dialogService.openConfirmDialog('Weet u zeker dat u de status van dit defect wilt wijzigen naar (' + status + ') ? Deze actie kan niet ongedaan worden gemaakt')
    .afterClosed().subscribe(res => {
      // console.log(res)
      if (res) {
        // Update
        this.reportService
        .updateReport(this.report, this.compressedImages)
        .subscribe(
          (res) => {
            this.toastr.success('De melding werd gewijzigd.', 'Succes!');
            location.reload();
          }
        );
        // annuleren

        this.moveReportToArchive();
        this.deleteReport();
        this.toastr.success('Het defect word gearchiveerd');
        this.router.navigate(['/']);

      }
    });
  }
    /**
     * functie om roept te sturen naar archief
     */
  moveReportToArchive() {
    this.archiveService.moveReportToArchive(this.report).subscribe(res => {

    });
  }
    /**
     * delete report van order Collectie
     */
  deleteReport() {
    this.reportService.deleteReport(this.report.id).subscribe(res => {

    });
  }

   /**
     * functie controleert welke status is geselecteert
     * @param event de selecteerde status
     * @returns Lijst van Etages adhv de geselecteerde status
     */
  onCampusChange(event) {
  if (event.target.value === 'ELL') {
    this.floors = ELLfloor;
    this.selectedCampus = 'ELL'

  } else {
    this.floors = NOOfloor;
    this.selectedCampus = 'NOO'
  }
  console.log(this.floors);
}
    /**
     * @returns lijst van etages adhv  Campus value in de geslecteerde defect voor update
     */
getEtageByCampus(){
  if(this.report.campus.toString() === 'ELL') {
    this.floors = ELLfloor;
  } else {
    this.floors = NOOfloor;
  }
}
    /**
     * @returns lijst van etages adhv  Etage value in de geslecteerde defect voor update
     */
getLocationByCampusAndFloor(){
  if (this.report.campus.toString()  === 'ELL') {
    if (this.report.floor === '-1') {
      this.locaties = ELLLocationfloorMin_1;
    } else if (this.report.floor === '0') {
      this.locaties = ELLLocationfloor_0;

    } else if (this.report.floor === '1') {
      this.locaties = ELLLocationfloor_1;

    } else if (this.report.floor === '2') {

      this.locaties = ELLLocationfloor_2;
    } else if (this.report.floor === '3') {
      this.locaties = ELLLocationfloor_3;

    } else if (this.report.floor === '4') {
      this.locaties = ELLLocationfloor_4;

    }
  } else {
        if (this.report.floor === '-1') {
      this.locaties = NOOLocationfloorMin_1;
    } else if (this.report.floor === '0') {
      this.locaties = NOOLocationfloor_0;

    } else if (this.report.floor === '1') {
      this.locaties = NOOLocationfloor_1;

    } else if (this.report.floor === '2') {

      this.locaties = NOOLocationfloor_2;
    } else if (this.report.floor === '3') {
      this.locaties = NOOLocationfloor_3;

    } else if (this.report.floor === '4') {
      this.locaties = NOOLocationfloor_4;

    } else if (this.report.floor === '5') {
      this.locaties = NOOLocationfloor_5;

    }
  }
}
    /**
     *
     * @param event geselecteerde Etage
     * @returns lijst van lokalen adhv de geselecteerde campus en Etage
     */
onEtageChange(event) {
  if (this.selectedCampus === 'ELL') {
    if (event.target.value === '-1') {
      this.locaties = ELLLocationfloorMin_1;
    } else if (event.target.value === '0') {
      this.locaties = ELLLocationfloor_0;

    } else if (event.target.value === '1') {
      this.locaties = ELLLocationfloor_1;

    } else if (event.target.value === '2') {

      this.locaties = ELLLocationfloor_2;
    } else if (event.target.value === '3') {
      this.locaties = ELLLocationfloor_3;

    } else if (event.target.value === '4') {
      this.locaties = ELLLocationfloor_4;

    }
  } else {
        if (event.target.value === '-1') {
      this.locaties = NOOLocationfloorMin_1;
    } else if (event.target.value === '0') {
      this.locaties = NOOLocationfloor_0;

    } else if (event.target.value === '1') {
      this.locaties = NOOLocationfloor_1;

    } else if (event.target.value === '2') {

      this.locaties = NOOLocationfloor_2;
    } else if (event.target.value === '3') {
      this.locaties = NOOLocationfloor_3;

    } else if (event.target.value === '4') {
      this.locaties = NOOLocationfloor_4;

    } else if (event.target.value === '5') {
      this.locaties = NOOLocationfloor_5;

    }
  }
}
}
