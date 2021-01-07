import { OrderCommentService } from './../services/order-comment.service';
import { OderComment, OrderCommentData } from './../models/Order';
import { Component, OnInit, HostListener } from '@angular/core';
import { OrderService } from '../services/create-task-service/order.service';
import { Order, Campus, Status } from '../models/Order';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../auth-service/auth.service';
import { ToastrService } from 'ngx-toastr';
import { MatTabChangeEvent, MatDialog } from '@angular/material';
import { Location } from '@angular/common';
import { CategoryService } from '../services/category.service';
import { ConfirmDialogService } from '../shared/confirm-dialog.service';
import { ArchiveService } from '../services/archive.service';
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
import { User } from '../models/User';
import { ExternalfirmsService } from '../services/externalfirms/externalfirms.service';
import { ExternalFirm } from '../models/ExternalFirm';
import { MailtemplateService } from '../services/mail-template/mailtemplate.service';
import { SendMailtemplateComponent } from '../send-mailtemplate/send-mailtemplate.component';
import { MailTemplate } from '../models/MailTemplate';

@Component({
  selector: 'app-task-detail',
  templateUrl: './task-detail.component.html',
  styleUrls: ['./task-detail.component.css'],
})
export class TaskDetailComponent implements OnInit {
  departments = ['Logistieke diensten'];
  groupMemberObject: User;
  employeesList: User[] = [];
  assignToUserInformation: User;
  id: string;
  order: Order;
  Categories: string[] = [];
  requesterId: string;
  orderId: string;
  campusen = Campus;
  selectedCampus: string;
  public campusenOption = [];
  statusen = Status;
  selectedStatus: string;
  public statusenOption = [];
  isLoaded: boolean;
  form: string;
  newInnerWidth;
  GroupNames: any;
  returnValue: boolean;
  public LogedInUser: any;
  public selectedIndex;
  public floors: string[];
  public locaties: string[];
  public comment: OderComment;
  comments: OrderCommentData[] = [];
  CommentText = '';
  public isDisable = false;
  CommentIndex;
  public isEditMode = false;
  newText;
  taakUrl: any;
  firmList: ExternalFirm[] = [];
  assignToFirmInformation: ExternalFirm;
  public firm;
  public selectedFirm;
  template: MailTemplate;
  templates = [];
  UserID = localStorage.getItem('UserID');
  constructor(
    private route: ActivatedRoute,
    private orderService: OrderService,
    public authService: AuthService,
    private location: Location,
    private toastr: ToastrService,
    private categoryService: CategoryService,
    private dialogService: ConfirmDialogService,
    private archiveService: ArchiveService,
    private router: Router,
    private orderCommentService: OrderCommentService,
    private externalFirmService: ExternalfirmsService,
    private mailTemplateService: MailtemplateService,
    private dialog: MatDialog
  ) {}

  ngOnInit() {
    this.taakUrl = location.href;
    this.requesterId = localStorage.getItem('UserID');
    this.id = this.route.snapshot.paramMap.get('id');
    this.LogedInUser = localStorage.getItem('UserID');
    this.getOrder();
    this.campusenOption = Object.keys(this.campusen);
    this.statusenOption = Object.values(this.statusen);
    this.newInnerWidth = window.innerWidth;
    this.getLogistiekeMedewerkerGroup();
    this.getLogistiekeCoordinatorGroup();
    const index = localStorage.getItem('userTabLocationTaskDetails') || 0; // get stored number or zero if there is nothing stored
    const indexNr = +index;
    this.getComment();
    this.selectedIndex = indexNr; // with tabGroup being the MatTabGroup accessed through ViewChild
    this.selectedIndex = indexNr;
    this.getAllFirms();
    this.getAllTemplates();
  }

  /**
   * This method passes logic depending on the size of the screen
   * @param event this holds the width of the current page
   */
  @HostListener('window:resize', ['$event'])
  onResize(event) {
    this.newInnerWidth = event.target.innerWidth;
    this.statusenOption = Object.values(this.statusen);
  }

  /**
   * This method fetches all coordinators of the logistic services
   * The fetched data is then pushed into the employeesList array
   */
  getLogistiekeCoordinatorGroup() {
    this.authService.getUsersListRoles().subscribe((res) => {
      res.forEach((element) => {
        if (element.role === 'LogistiekeCoordinator') {
          this.assignToUserInformation = {
            id: element.id,
            email: element.email,
            name: element.name,
          };
          this.employeesList.push(this.assignToUserInformation);
        }
      });
    });
  }

  /**
   * This method fetches all general employees belonging to the logistic services
   * The fetched data is then pushed into the employeeList array
   */
  getLogistiekeMedewerkerGroup() {
    this.authService.getUsersListRoles().subscribe((res) => {
      res.forEach((element) => {
        if (element.role === 'LogistiekeMedewerker') {
          this.assignToUserInformation = {
            id: element.id,
            email: element.email,
            name: element.name,
          };
          this.employeesList.push(this.assignToUserInformation);
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
  }

  /**
   * This method assigns an order to an employee.
   * To do this, a call is made to the order service
   * We pass three parameters: the information of the employee the order is to be assigned to (assignToUserInformation),
   * the id of the assigner, and the id of the order to be assigned
   */
  getSelectedAssignedUserInformation() {
    this.orderService
      .assignOrderToEmployee(
        this.assignToUserInformation,
        this.requesterId,
        this.id
      )
      .subscribe(
        (result) => {
          this.toastr.success(
            `Taak is succesfully toegevoegd aan ${this.assignToUserInformation.name}`
          );
          this.getOrder();
          // document.getElementById('externe').style.visibility = 'hidden';
        },
        (error) => {
          this.toastr.error('Er is een fout opgetreden.');
        }
      );
  }

  /**
   * This method fetches a specific order from the database based on the id
   * It also fetches all categories based on campus, floor based on campus
   * and location based on campus and floor
   */
  getOrder() {
    this.orderService.getOrder(this.id).subscribe((data: any) => {
      if (data !== null) {
        this.order = data;
        this.getCategoryByDepartment();
        this.getEtageByCampus();
        this.getLocationByCampusAndFloor();
        this.isLoaded = true;
      } else {
        this.isLoaded = false;
      }
    });
  }


  /**
   * This method fetches a list of categories from the database depending on the department
   * A call is made to the categories service and the fetched data is stored in the
   * categories array variable
   */
  getCategoryByDepartment() {
    this.categoryService
      .getCategoriesBydepartment(this.order.categoryDepartment)
      .subscribe(
        (res) => {
          this.Categories = res[0].categories;
        },
        (error) => {
          console.log(error);
        }
      );
  }

  /**
   * This method is responsible for updating an existing order depending on the status
   * If the order has been executed or will not executed, the order is moved to archive
   * If not, information about the order can be editted and updated.
   * P.S. Only the requester of the order can edit the order information
   */
  updateOrder() {
    if (
      this.order.status === 'Wordt niet uitgevoerd' ||
      this.order.status === 'Voltooid'
    ) {
      this.whenOrderNotDoneOrDone(this.order.status);
    } else {
      const title = this.order.title.replace(/ {2,}/g, ' ').trim();
      const describtion = this.order.description.replace(/ {2,}/g, ' ').trim();
      this.order.title = title;
      this.order.description = describtion;
      this.orderService.updateOrder(this.order).subscribe(
        (res) => {
          this.toastr.success('De melding werd gewijzigd.', 'Succes!');
          this.getOrder();
        },
        (error) => {
          this.toastr.error('Er is een fout opgetreden.', 'Error!');
        }
      );
    }
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
    localStorage.setItem('userTabLocationTaskDetails', event.index.toString());
  }

  /**
   * This method is responsible for cancelling an order
   * After an order is cancelled, it is deleted from the orders collection and
   * moved to the archive collection
   * You always receive an alert to verify if you really want to cancel the order
   */
  onCancleOrder() {
    this.dialogService
      .openConfirmDialog(
        'Weet u zeker dat u deze taak wilt annuleren? Deze actie kan niet ongedaan worden gemaakt'
      )
      .afterClosed()
      .subscribe((res) => {
        if (res) {
          // Update
          this.order.status = this.statusen.DISCARDED;
          // tslint:disable-next-line:no-shadowed-variable
          this.orderService.updateOrder(this.order).subscribe((res) => {
            this.toastr.success('De taak werd gewijzigd.', 'Succes!');
          });
          // annuleren
          this.moveOrderToArchive();
          this.deleteOrder();
          this.toastr.success('Het order word gearchiveerd.');
          this.router.navigate(['/']);
        }
      });
  }

  /**
   * This method gives a prompt when moving an order to archive depending on its status
   * The move is done when the status is either 'done' or 'not to be executed'
   * If 'yes' is selected from the prompt, the move is carried out
   * @param status this is the status of the order
   */
  whenOrderNotDoneOrDone(status: string) {
    this.dialogService
      .openConfirmDialog(
        'Weet u zeker dat u de status van dit order wilt wijzigen naar (' +
          status +
          ') ? Deze actie kan niet ongedaan worden gemaakt'
      )
      .afterClosed()
      .subscribe((res) => {
        if (res) {
          // Update
          // tslint:disable-next-line:no-shadowed-variable
          this.orderService.updateOrder(this.order).subscribe((res) => {
            this.toastr.success('De taak werd gewijzigd.', 'Succes!');
            this.getOrder();
          });
          // annuleren
          this.moveOrderToArchive();
          this.deleteOrder();
          this.toastr.success('De taak wordt gearchiveerd.');
          this.router.navigate(['/']);
        }
      });
  }

  /**
   * This method is the main method responsible for moving an order to archive
   */
  moveOrderToArchive() {
    this.archiveService.moveOrderToArchive(this.order).subscribe((res) => {});
  }

  /**
   * This method is responsible for deleting an order from the collection
   */
  deleteOrder() {
    this.orderService.deleteOrder(this.order.id).subscribe((res) => {});
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
    if (this.order.campus.toString() === 'ELL') {
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
    if (this.order.campus.toString() === 'ELL') {
      if (this.order.floor === '-1') {
        this.locaties = ELLLocationfloorMin_1;
      } else if (this.order.floor === '0') {
        this.locaties = ELLLocationfloor_0;
      } else if (this.order.floor === '1') {
        this.locaties = ELLLocationfloor_1;
      } else if (this.order.floor === '2') {
        this.locaties = ELLLocationfloor_2;
      } else if (this.order.floor === '3') {
        this.locaties = ELLLocationfloor_3;
      } else if (this.order.floor === '4') {
        this.locaties = ELLLocationfloor_4;
      }
    } else {
      if (this.order.floor === '-1') {
        this.locaties = NOOLocationfloorMin_1;
      } else if (this.order.floor === '0') {
        this.locaties = NOOLocationfloor_0;
      } else if (this.order.floor === '1') {
        this.locaties = NOOLocationfloor_1;
      } else if (this.order.floor === '2') {
        this.locaties = NOOLocationfloor_2;
      } else if (this.order.floor === '3') {
        this.locaties = NOOLocationfloor_3;
      } else if (this.order.floor === '4') {
        this.locaties = NOOLocationfloor_4;
      } else if (this.order.floor === '5') {
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

    this.order.location = this.locaties[0];
  }

  /**
   * This method is responsible for adding comments about an order
   * It also saves who created addded the comment
   */
  addComment() {
    if (this.CommentText.trim() !== '') {
      if (this.CommentText !== null) {
        const comment = this.CommentText.replace(/ {2,}/g, ' ').trim();
        this.comment = new OderComment();
        const commentDate: OrderCommentData = {
          createdByName: localStorage.getItem('UserName'),
          createdById: localStorage.getItem('UserID'),
          text: comment,
        };
        this.orderCommentService
          .addComment(this.comment, this.order.id, commentDate)
          .subscribe((res) => {
            this.CommentText = null;
            this.getComment();
          });
      }
    } else {
      this.CommentText = null;
    }
  }

  /**
   * This method fectches all comments about a report from the ReportComments collection
   * The comments are saved in the 'comments' variable
   */
  getComment() {
    this.orderCommentService.getComment(this.id).subscribe((res: any) => {
      if (res !== null) {
        this.comments = res.orderCommentData;
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
      const comment = this.newText.replace(/ {2,}/g, ' ').trim();
      this.orderCommentService
        .updateComment(this.id, index, comment)
        .subscribe((res) => {
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
    this.orderCommentService.deleteComment(this.id, index).subscribe((res) => {
      this.getComment();
    });
  }



  // ------------------------------------------- SEND MAIL LOGIC -----------------------------------------------------------------

/**
 * This method opens the SendMailtemplateComponent dialog for the sending of mails to external firm
 * @param id this is the id of the template
 * @param taakUrl this is the URL of the order to be forwarded to the external firm
 * @param selectedFirm this contains the information of the slelected firm to receive the mail
 * @param externalFirmId this is the id of the firm from the external firm collection
 */
openSendMailTemplateDialog(id, taakUrl, selectedFirm, externalFirmId) {
  this.dialog.open(SendMailtemplateComponent, {
    width: '1000px',
    height: '580px',
    data: {
      id,
      taakUrl,
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
  this.openSendMailTemplateDialog(id, this.taakUrl, this.selectedFirm, this.assignToFirmInformation.id);
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
    res.forEach(element => {
        this.assignToFirmInformation = {
          id: element.id,
          email : element.email,
          displayName : element.displayName,
          telefonNr: element.telefonNr
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
    telefonNr: this.selectedFirm.telefonNr
  };
  console.log(this.assignToFirmInformation);

}

/**
 * This method is responsible for assigning a report to an external firm
 * It calls the 'assignReportToFirm()' method from the reportService
 * Gives the information of the firm, the reporter, and the report as parameters
 */
getSelectedAssignedFirmInformation() {
  this.orderService
    .assignOrderToFirm(
      this.assignToFirmInformation,
      this.requesterId,
      this.id
    )
    .subscribe(
      (result) => {
        this.toastr.success(
          `Taak is succefully toegewezen aan ${this.assignToFirmInformation.displayName}`

        );
        this.getOrder();
        // document.getElementById('medewerker').style.visibility = 'hidden';
      },
      (error) => {
        this.toastr.error('Er is een fout opgetreden.');
      }
    );
}




// ---------------------------------------- SEND MAIL LOGIC -----------------------------------------------------------------
}
