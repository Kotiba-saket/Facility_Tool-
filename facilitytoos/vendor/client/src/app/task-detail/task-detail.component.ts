import { Component, OnInit, HostListener } from '@angular/core';
import { OrderService } from '../services/create-task-service/order.service';
import { Order, AzureUser, Campus, Status } from '../models/Order';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../auth-service/auth.service';
import { ToastrService } from 'ngx-toastr';
import { MatTabChangeEvent } from '@angular/material';
import {Location} from '@angular/common';
import { CategoryService } from '../services/category.service';
import { ConfirmDialogService } from '../shared/confirm-dialog.service';
import { ArchiveService } from '../services/archive.service';
import {ELLfloor, NOOfloor, ELLLocationfloorMin_1, ELLLocationfloor_0,
  ELLLocationfloor_1, ELLLocationfloor_2, ELLLocationfloor_3, ELLLocationfloor_4,
  NOOLocationfloorMin_1, NOOLocationfloor_0, NOOLocationfloor_1,
  NOOLocationfloor_2, NOOLocationfloor_3, NOOLocationfloor_4, NOOLocationfloor_5
  }from '../models/groundplans';
@Component({
  selector: 'app-task-detail',
  templateUrl: './task-detail.component.html',
  styleUrls: ['./task-detail.component.css']
})
export class TaskDetailComponent implements OnInit {
  departments = [
    'Logistieke diensten'
  ]

  groupMemberObject: AzureUser;
  employeesList: AzureUser[] = [];
  assignToUserInformation: AzureUser;
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
  constructor(private route: ActivatedRoute, private orderService: OrderService, public authService: AuthService,
    private _location: Location, private activatedRoute: ActivatedRoute, private toastr: ToastrService, private categoryService : CategoryService,
    private dialogService: ConfirmDialogService,
    private archiveService:ArchiveService,
    private router:Router) { }

  ngOnInit() {
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

    this.selectedIndex = indexNr; // with tabGroup being the MatTabGroup accessed through ViewChild
    this.selectedIndex  = indexNr;
  }


  @HostListener('window:resize', ['$event'])
  onResize(event) {
    this.newInnerWidth = event.target.innerWidth;
    this.statusenOption = Object.values(this.statusen);
  }



/**
 * krijg je hier alle leden van logistiekecoordinator groep en we lopen de response,
 * dan we voegen alle members id's en displayname in employeesList array
 */
  getLogistiekeCoordinatorGroup() {
    this.authService.getMembersOfGroup('2e04f900-f159-4605-bca2-1b581948c00b').subscribe(res => {
      res.value.forEach((element) => {
        this.assignToUserInformation = {
          azureUserId: element.id,
          displayName: element.displayName,
        };
        this.employeesList.push(this.assignToUserInformation);
    });
  });
  }

 /**
 * krijg je hier alle leden van logistiekemedewerker groep en we lopen de response,
 * dan we voegen alle members id's en displayname in employeesList array
 */
  getLogistiekeMedewerkerGroup() {
    this.authService.getMembersOfGroup('be4b7dc3-1f7d-4261-8a09-cffdceea15eb').subscribe(res => {
      res.value.forEach((element) => {
        this.assignToUserInformation = {
          azureUserId: element.id,
          displayName: element.displayName,
        };
        this.employeesList.push(this.assignToUserInformation);
    });
  });
  }

  onChange(e) {
    this.assignToUserInformation = {
      azureUserId:  e.target.value,
      displayName: e.target.options[e.target.options.selectedIndex].text
    }
  }

  // onCampusChange(Campus) {
  //   this.selectedCampus = Campus;
  //   console.log(this.selectedCampus);
  // }

  onStatusChange(Status) {
    this.selectedStatus = Status;
    console.log(this.selectedStatus);
  }


  getSelectedAssignedUserInformation(){

    this.orderService.assignOrderToEmployee(this.assignToUserInformation,this.requesterId,this.id).subscribe( result => {
      console.log('Report is assigned to emplyee');
      this.toastr.success(`taak is succesfully toegevoegd aan ${this.assignToUserInformation.displayName}`)
    }, error => {
      this.toastr.error('er is een error');
    })
 }

 getOrder(){
  this.orderService.getOrder(this.id).subscribe(data => {
    if(data !== null){
      this.order = data;
      this.getCategoryByDepartment();
      this.getEtageByCampus();
      this.getLocationByCampusAndFloor();
      this.isLoaded = true;
    } else{
      this.isLoaded = false;
    }

  });
}


// Wijzigt de knop in de detailview op basis van de tab waarin de gebruiker zich bevindt.
tabChange(e:MatTabChangeEvent)
  {
    let label = document.getElementById('interactLabel');

    switch(e.tab.textLabel)
    {
      case 'Algemeen':
        label.innerText = 'ABBONEREN';
        return;
      case 'Reacties':
        label.innerText = 'PLAATSEN';
        return;
      case 'Wijzigen':
        label.innerText = 'UPDATEN';
        return;
      case 'Toewijzen':
        label.innerText = 'TOEWIJZEN';
        return;
      case 'Status wijzigen':
        label.innerText = 'UPDATEN';
        return;
    }
  }


   /**
   * deze function call backend function om Alle  Categorie vanuit database te halen
   *
   */
  getCategoryByDepartment(){
    this.categoryService.getCategoriesBydepartment(this.order.categoryDepartment).subscribe(res => {
      //console.log(res[0].categories);
      this.Categories = res[0].categories;
    }, error => {
      console.log(error);
    })
  }


  onDepartmentChange(e){
    console.log(e.target.value);
    const department = e.target.value;
    this.categoryService.getCategoriesBydepartment(department).subscribe(res => {
      //console.log(res[0].categories);
      this.Categories = res[0].categories;
    }, error => {
      console.log(error);
    })
  }


updateOrder()
  {
    if (this.order.status === 'Wordt niet uitgevoerd' || this.order.status === 'Voltooid') {
      this.whenOrderNotDoneOrDone(this.order.status);
      console.log("test status")
    } else {
      this.orderService.updateOrder(this.order).subscribe(res => {
        this.toastr.success('De taak werd gewijzigd.', 'Succes!');
        location.reload();
      }, error => {
        this.toastr.error('Er is een fout opgetreden.', 'Error!');
      })
    }

  }
  goBack(){
    this._location.back();
  }


    handleMatTabChange(event: MatTabChangeEvent) {
      localStorage.setItem('userTabLocationTaskDetails', event.index.toString());
      console.log(event.index);
    }
    /**
     * deze function annuleert het report en stuurt het naar de archief
     * als de gebruiker accepteert dat
     */
    onCancleOrder() {
      this.dialogService.openConfirmDialog('Weet u zeker dat u dit order wilt annuleren? Deze actie kan niet ongedaan worden gemaakt')
      .afterClosed().subscribe(res => {
        if(res) {
              // Update
              this.order.status = this.statusen.DISCARDED;
              this.orderService.updateOrder(this.order).subscribe(res => {
                this.toastr.success('De taak werd gewijzigd.', 'Succes!');
              });
          // annuleren
           this.moveOrderToArchive();
           this.deleteOrder();
           this.toastr.success('Het order word gearchiveerd');
           this.router.navigate(['/']);

        }
      })
    }
    /**
     * defect archiveren wanneer de order status wordt voltooid of wordt niet uitgevoerd
     * @param status status van defect
     */

    whenOrderNotDoneOrDone(status:String) {
      this.dialogService.openConfirmDialog('Weet u zeker dat u de status van dit order wilt wijzigen naar (' + status + ') ? Deze actie kan niet ongedaan worden gemaakt')
      .afterClosed().subscribe(res => {
        // console.log(res)
        if (res) {
          // Update
          this.orderService.updateOrder(this.order).subscribe(res => {
            this.toastr.success('De taak werd gewijzigd.', 'Succes!');
          });
          // annuleren
           this.moveOrderToArchive();
           this.deleteOrder();
           this.toastr.success('Het order word gearchiveerd');
           this.router.navigate(['/']);

        }
      });
    }
    /**
     * functie om order te sturen naar archief
     */
    moveOrderToArchive(){
      this.archiveService.moveOrderToArchive(this.order).subscribe(res => {
      });
    }
    /**
     * delete order van order Collectie
     */
    deleteOrder(){
      this.orderService.deleteOrder(this.order.id).subscribe(res => {
      })
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
     * @returns lijst van etages adhv  Campus value in de geslecteerde order voor update
     */
    getEtageByCampus(){
      if(this.order.campus.toString()  === 'ELL'){
        this.floors = ELLfloor;
      } else {
        this.floors = NOOfloor;
      }
    }
    /**
     * @returns lijst van etages adhv  Etage value in de geslecteerde order voor update
     */
    getLocationByCampusAndFloor(){
      if (this.order.campus.toString()  === 'ELL') {
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
