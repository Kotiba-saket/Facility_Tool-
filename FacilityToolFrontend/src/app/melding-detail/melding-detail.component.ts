import { CommentService } from './../services/comment.service';
import { ArchiveService } from './../services/archive.service';
import { ConfirmDialogService } from './../shared/confirm-dialog.service';
import { Component, OnInit, HostListener } from '@angular/core';
import { ReportService } from '../services/report.service';
import {
  Report,
  Campus,
  Status,
  Category,
  ReportCommentData,
} from '../models/Report';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../auth-service/auth.service';
import { MatTabChangeEvent, MatDialog } from '@angular/material';
import { UpVoteService } from '../services/upvote/up-vote.service';
import { ToastrService } from 'ngx-toastr';
import { Location } from '@angular/common';
import { CategoryService } from '../services/category.service';
import { CompressorService } from '../services/Compressor.service';
import { map, expand } from 'rxjs/operators';
import { EMPTY } from 'rxjs';
import { ReportComment } from './../models/Report';
import {
  ELLfloor,
  NOOfloor,
  ELLLocationfloorMin_1,
  ELLLocationfloor_0,
  ELLLocationfloor_1,
  ELLLocationfloor_2,
  ELLLocationfloor_3,
  ELLLocationfloor_4,
  NOOLocationfloorMin_1,
  NOOLocationfloor_0,
  NOOLocationfloor_1,
  NOOLocationfloor_2,
  NOOLocationfloor_3,
  NOOLocationfloor_4,
  NOOLocationfloor_5,
} from '../models/groundplans';
import { ExternalfirmsService } from '../services/externalfirms/externalfirms.service';
import { element } from 'protractor';
import { MailtemplateService } from '../services/mail-template/mailtemplate.service';
import { MailTemplate } from '../models/MailTemplate';
import { SendMailtemplateComponent } from '../send-mailtemplate/send-mailtemplate.component';
import { User } from '../models/User';
import { ExternalFirm } from '../models/ExternalFirm';
@Component({
  selector: 'app-melding-detail',
  templateUrl: './melding-detail.component.html',
  styleUrls: ['./melding-detail.component.css'],
})
export class MeldingDetailComponent implements OnInit {
  allCategories: Category[];
  departments: string[] = [];
  groupMemberObject: User;
  emplyeesList: User[] = [];
  assignToUserInformation: User;
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
  template: MailTemplate;
  templates = [];
  public comment: ReportComment;
  comments: ReportCommentData[] = [];
  CommentText = '';
  public isDisable = false;
  CommentIndex;
  public isEditMode = false;
  newText;
  meldingUrl: any;
  firmList: ExternalFirm[] = [];
  assignToFirmInformation: ExternalFirm;
  public firm;
  public selectedFirm;
  externalFirmId: string;
  public isFirm: boolean;
  public isMedewerker: boolean;
  constructor(
    private route: ActivatedRoute,
    private reportService: ReportService,
    public authService: AuthService,
    private toastr: ToastrService,
    private upVoteService: UpVoteService,
    private location: Location,
    private categoryService: CategoryService,
    private compressor: CompressorService,
    private dialogService: ConfirmDialogService,
    private archiveService: ArchiveService,
    private router: Router,
    private dialog: MatDialog,
    private mailTemplateService: MailtemplateService,
    private commentService: CommentService,
    private externalFirmService: ExternalfirmsService
  ) {}

  data: FileList;
  GroupNames: any;
  compressedImages = [];
  ngOnInit() {
    this.meldingUrl = location.href;
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
    this.selectedIndex = indexNr;
    this.getFacilityCoordinatorGroup();
    this.getAllTemplates();
    this.getAllCategories();
    this.getComment();
    this.comment = new ReportComment();
    this.getAllFirms();
  }

  /**
   * This method helps to compress images to save space in the database
   */
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

  /**
   * The whole processes involved in the compression of images take place insided this method
   * @param event this holds the data of the image to undergo compression
   */
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

  /**
   * This method passes logic depending on the size of the screen
   * @param event this holds the width of the current page
   */
  @HostListener('window:resize', ['$event'])
  onResize(event) {
    this.newInnerWidth = event.target.innerWidth;
    this.statusList = Object.values(this.status);
  }

  /**
   * This method fetches all general employees belonging to the facility services
   * The fetched data is then pushed into the employeeList array
   */
  getFacilityMedewerkerGroup() {
    this.authService.getUsersListRoles().subscribe((res: any) => {
      // tslint:disable-next-line:no-shadowed-variable
      res.forEach((element) => {
        if (element.role === 'FacilitaireMedewerker') {
          this.assignToUserInformation = {
            id: element.id,
            email: element.email,
            name: element.name,
          };
          this.emplyeesList.push(this.assignToUserInformation);
        }
      });
    });
  }

  /**
   * This method fetches all coordinators of the facility services
   * The fetched data is then pushed into the employeeList array
   */
  getFacilityCoordinatorGroup() {
    this.authService.getUsersListRoles().subscribe((res: any) => {
      // tslint:disable-next-line:no-shadowed-variable
      res.forEach((element) => {
        if (element.role === 'FacilitaireCoordinator') {
          this.assignToUserInformation = {
            id: element.id,
            email: element.email,
            name: element.name,
          };
          this.emplyeesList.push(this.assignToUserInformation);
        }
      });
    });
  }

  /**
   * The list of employees are given in a dropdown menu. This method is responsible for
   * checking to see if a new employee has been selected from the list
   * @param e this holds all the information(id and name) of the selected employee
   */
  onChange(e) {
    this.assignToUserInformation = {
      id: e.target.value,
      name: e.target.options[e.target.options.selectedIndex].text,
    };
    this.isFirm = false;
  }

  /**
   * This method assigns a report to an employee.
   * To do this, a call is made to the report service
   * We pass three parameters: the information of the employee the report is to be assigned to (assignToUserInformation),
   * the id of the assigner, and the id of the report to be assigned
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
            `defect is succefully toegevoegd aan ${this.assignToUserInformation.name}`
          );
          this.getReport();
          document.getElementById('externe').style.display = 'none';
        },
        (error) => {
          this.toastr.error('Er is een fout opgetreden.');
        }
      );
  }

  /**
   * This method fetches specific reports from the database based on the id
   * It also fetches all categories based on campus, floor based on campus
   * and location based on campus and floor
   * It also checks if the logged in user has subscribed to the fetched report
   */
  getReport() {
    this.reportService.getReport(this.id).subscribe((data: any) => {
      if (data !== null) {
        this.report = data;

        this.getCategoryByDepartment();
        this.getEtageByCampus();
        this.getLocationByCampusAndFloor();
        this.isLoaded = true;
        // tslint:disable-next-line:no-shadowed-variable
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

  /**
   * This method is responsible for updating an existing report depending on the status
   * If the report has been executed or will not executed, the report is moved to archive
   * If not, information about the report can be editted and updated.
   * P.S. Only the reporter of the report can edit the report information
   */
  updateReport() {
    if (
      this.report.status === 'Wordt niet uitgevoerd' ||
      this.report.status === 'Voltooid'
    ) {
      this.whenReportNotDoneOrDone(this.report.status);
      console.log('test status');
    } else {
      this.reportService
        .updateReport(this.report, this.compressedImages)
        .subscribe(
          (res) => {
            this.toastr.success('De melding werd gewijzigd.', 'Succes!');
            this.getReport();
          },
          (error) => {
            this.toastr.error('Er is een fout opgetreden.', 'Error!');
          }
        );
    }
  }

  /**
   * This method gives a specific color to priority based on the number of upvotes
   * @param priority The priority/number of votes is given as parameter to determine
   * the color to be given
   */
  setPriorityColor(priority): string {
    if (priority >= 0 && priority < 5) {
      return '#28a745'; // Green
    } else if (priority < 11) {
      return '#ffa500'; // Orange
    } else {
      return '#af0412'; // Red
    }
  }

  /**
   * This method fetches a list of categories from the database depending on the department
   * A call is made to the categories service and the fetched data is stored in the
   * categories array variable
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

  /**
   * This method fetches all categories from the categories collection in the database
   * The fetched data is stored in the 'allCategories' object variable
   * If the category falls under the logistic services, it is pushed into the
   * 'departments' array variable
   */
  getAllCategories() {
    this.categoryService.getAllCategories().subscribe((data: any) => {
      this.allCategories = data;

      data.forEach((c) => {
        if (c.department !== 'Logistieke diensten') {
          this.departments.push(c.department);
        }
      });
    });
  }

  /**
   * This method is responsible for targeting categories that belong to a selected department
   * When a new department is selected from the dropdown, all categories that fall under is
   * searched for and pushed into the 'Categories' array
   * @param e this is the targeted department
   */
  onDepartmentChange(e) {
    console.log(e.target.value);
    const department = e.target.value;
    this.Categories = [];

    // Gooi de categories van de gekozen departement in Categorie
    this.allCategories
      .find((c) => c.department === department)
      .categories.forEach((c) => this.Categories.push(c));

    // Neem de eerste categorie uit de lijst aan
    this.report.category = this.Categories[0];
  }

  /**
   * This method is responsible for making subscriptions to reports
   * It checks if the user has already subscribed to the report
   * If so, the user is unsubscribed upon calling the method for the second time
   * If not, he is subcribed to the report on the first call
   */
  subscription() {
    // tslint:disable-next-line:no-shadowed-variable
    this.report.subscribers.forEach((element) => {
      if (element === this.UserID) {
        this.isGeaboneerd = true;
      }
    });
    this.isGeaboneerd = !this.isGeaboneerd;

    this.upVoteService.updateUserVote(this.report, this.UserID);
    console.log('is Geaboneerd = ' + this.isGeaboneerd);
  }

  /**
   * This method navigates to the previous page
   */
  goBack() {
    this.location.back();
  }

  /**
   * This method saves the currently selected tab index to localStorage
   * This helps to stay on the same tab after refresh or when returning from a another page
   * @param event this is the change in tab
   */
  handleMatTabChange(event: MatTabChangeEvent) {
    localStorage.setItem('userTabLocationDetails', event.index.toString());
    console.log(event.index);
  }

  /**
   * This method is responsible for cancelling a report
   * After a report is cancelled, it is deleted from the reports collection and
   * moved to the archive collection
   * You always receive an alert to verify if you really want to cancel the report
   */
  onCancelReport() {
    this.dialogService
      .openConfirmDialog(
        'Weet u zeker dat u dit defect wilt annuleren? Deze actie kan niet ongedaan worden gemaakt'
      )
      .afterClosed()
      .subscribe((res) => {
        // console.log(res)
        if (res) {
          // Update
          this.report.status = this.status.DISCARDED;
          this.reportService
            .updateReport(this.report, this.compressedImages)
            .subscribe(
              // tslint:disable-next-line:no-shadowed-variable
              (res) => {
                this.toastr.success('De melding werd gewijzigd.', 'Succes!');
                location.reload();
              }
            );
          // annuleren
          this.moveReportToArchive();
          this.deleteReport();
          this.toastr.success('Het defect wordt gearchiveerd.');
          this.router.navigate(['/']);
        }
      });
  }

  /**
   * This method gives a prompt when moving a report to archive depending on its status
   * The move is done when the status is either 'done' or 'not to be executed'
   * If 'yes' is selected from the prompt, the move is carried out
   * @param status this is the status of the report
   */
  whenReportNotDoneOrDone(status: string) {
    this.dialogService
      .openConfirmDialog(
        'Weet u zeker dat u de status van dit defect wilt wijzigen naar (' +
          status +
          ') ? Deze actie kan niet ongedaan worden gemaakt'
      )
      .afterClosed()
      .subscribe((res) => {
        // console.log(res)
        if (res) {
          // Update
          this.reportService
            .updateReport(this.report, this.compressedImages)
            .subscribe(
              // tslint:disable-next-line:no-shadowed-variable
              (res) => {
                this.toastr.success('De melding werd gewijzigd.', 'Succes!');
                this.getReport();
              }
            );
          // annuleren

          this.moveReportToArchive();
          this.deleteReport();
          this.toastr.success('Het defect wordt gearchiveerd');
          this.router.navigate(['/']);
        }
      });
  }

  /**
   * This method is the main method responsible for moving a report to archive
   */
  moveReportToArchive() {
    this.archiveService.moveReportToArchive(this.report).subscribe((res) => {});
  }

  /**
   * This method is responsible for deleting a report from the collection
   */
  deleteReport() {
    this.reportService.deleteReport(this.report.id).subscribe((res) => {});
  }

  /**
   * This method is responsible for getting the information of the selected campus from the dropdown list
   * The information is then stored in the 'selectedCampus' variable
   * @param event this is the selected campus
   */
  onCampusChange(event) {
    if (event.target.value === 'ELL') {
      this.floors = ELLfloor;
      this.selectedCampus = 'ELL';
    } else {
      this.floors = NOOfloor;
      this.selectedCampus = 'NOO';
    }
  }

  /**
   * This method generates a list of floors based on the selected campus
   * The list of floors are stored in the 'floors' array
   */
  getEtageByCampus() {
    if (this.report.campus.toString() === 'ELL') {
      this.floors = ELLfloor;
    } else {
      this.floors = NOOfloor;
    }
  }

  /**
   * This method generates a list of locations based on a specific campus and floor
   * The list of locations are stored in the 'locaties' variables
   */
  getLocationByCampusAndFloor() {
    if (this.report.campus.toString() === 'ELL') {
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
   * This method is responsible for getting the locations
   * This is based on which campus and floor is selected
   * The information is then stored in the 'locaties' variable
   * @param event this is the selected floor
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

    this.report.location = this.locaties[0];
  }

// ------------------------------------------- SEND MAIL LOGIC -----------------------------------------------------------------

/**
 * This method opens the SendMailtemplateComponent dialog for the sending of mails to external firm
 * @param id this is the id of the template
 * @param meldingUrl this is the URL of the report to be forwarded to the external firm
 * @param selectedFirm this contains the information of the slelected firm to receive the mail
 * @param externalFirmId this is the id of the firm from the external firm collection
 */
openSendMailTemplateDialog(id, meldingUrl, selectedFirm, externalFirmId) {
  this.dialog.open(SendMailtemplateComponent, {
    width: '1000px',
    height: '580px',
    data: {
      id,
      meldingUrl,
      selectedFirm,
      externalFirmId
    }
  });
}

/**
 * This method gets the mail template to be used in sending the mail
 * It populates the template with the report URL and the details of the firm
 * @param id this is the id of the template to be used
 */
getTemplateById(id) {
  this.openSendMailTemplateDialog(id, this.meldingUrl, this.selectedFirm, this.assignToFirmInformation.id);
}

/**
 * This method is responsible for fetching a specific template from the mailtemplates collection
 * The fetched data is stored in the 'template' variable
 */
getTemplate() {
  this.mailTemplateService.getTemplate(this.id).subscribe((res: any) => {
    this.template = res;
    console.log(this.template);
  });
}



/**
 * This method fetches all templates inside the mailtemplates collection
 * The fetched templates are stored inside the 'templates' array variable
 */
  getAllTemplates() {
    this.mailTemplateService.getAllTemplates().subscribe((res: any) => {
      this.templates = res;
      console.log(`This is from GetAllTemplates` + this.templates);
    });
  }

  /**
   * This method fetches all external firms from the externalfirms collection
   * Each of the firms is saved into the 'assignToFirmInformation' variable
   * This makes it easy to relate to the firms individually
   * All the firms are also pushed into the firmList array variable
   */
  getAllFirms() {
    this.externalFirmService.getAllFirms().subscribe((res: any) => {
      // tslint:disable-next-line:no-shadowed-variable
      res.forEach((element) => {
        this.assignToFirmInformation = {
          id: element.id,
          email: element.email,
          displayName: element.displayName,
          telefonNr: element.telefonNr,
        };
        this.firmList.push(this.assignToFirmInformation);
      });
    });
    console.log(this.assignToFirmInformation);
  }

  /**
   * This method targets the currently selected firm from the dropdown
   * The data about that firm is saved inside the 'selectedFirm' variable
   * This helps with the easy manipulation of the selected firm data
   */
  onFirmChange() {
    // console.log(this.selectedFirm);
    this.assignToFirmInformation = {
      id: this.selectedFirm.id,
      email: this.selectedFirm.email,
      displayName: this.selectedFirm.displayName,
      telefonNr: this.selectedFirm.telefonNr,
    };
    console.log(this.assignToFirmInformation);
  }

  /**
   * This method is responsible for assigning a report to an external firm
   * It calls the 'assignReportToFirm()' method from the reportService
   * Gives the information of the firm, the reporter, and the report as parameters
   */
  getSelectedAssignedFirmInformation() {
    this.reportService
      .assignReportToFirm(
        this.assignToFirmInformation,
        this.reporterId,
        this.id
      )
      .subscribe(
        (result) => {
          this.toastr.success(
            `Defect is succefully toegewezen aan ${this.assignToFirmInformation.displayName}`

          );
          this.getReport();
          this.externalFirmId = this.assignToFirmInformation.id;
          document.getElementById('medewerker').style.display = 'none';
        },
        (error) => {
          this.toastr.error('Er is een fout opgetreden.');
        }
      );
  }

  // ---------------------------------------- SEND MAIL LOGIC -----------------------------------------------------------------

  /**
   * This method is responsible for adding comments about a report
   * It also saves who created addded the comment
   */
  AddComment() {
    console.log(this.CommentText);
    if (this.CommentText !== '') {
      if ( this.CommentText !== null) {
        this.comment = new ReportComment();
        const commentDate: ReportCommentData = {
          createdByName: localStorage.getItem('UserName'),
          createdById: localStorage.getItem('UserID'),
          text: this.CommentText
        };
        this.commentService.addComment(this.comment, this.report.id, commentDate).subscribe(res => {
          console.log(res);
          this.CommentText = null;
          this.getComment();
        });
      }

    }

  }

  /**
   * This method fectches all comments about a report from the ReportComments collection
   * The comments are saved in the 'comments' variable
   */
  getComment() {
    this.commentService.getComment(this.id).subscribe((res: any) => {
      if (res !== null) {
        this.comments = res.reportCommentData;
      }

    });
  }

  /**
   * This method is responsible for editing a comment
   * @param index this is the comment to be edited
   */
  edit(index) {
    // this.comments.splice(0,1);
    this.CommentIndex = index;
    this.isEditMode = true;
  }

  /**
   * This method is responsible for updating an edited comment
   * @param index this is the comment to be updated
   */
  update(index) {
     if (this.newText !== undefined) {
      this.isEditMode = false;
      this.commentService.updateComment(this.id, index, this.newText).subscribe(res => {
        console.log(res);
        this.getComment();
      });
     } else {
      this.isEditMode = false;
     }

  }

  /**
   * This method sets the comment content to the updated content
   * @param content this is the updated comment
   */
  onChangeComment(content) {
    this.newText = content;
  }

  /**
   * This method is responsible for deleting a comment
   * @param index this is the comment to be deleted
   */
  delete(index) {
    this.commentService.deleteComment( this.id, index).subscribe(res => {
      console.log(res);
      this.getComment();
    });
  }
  }
