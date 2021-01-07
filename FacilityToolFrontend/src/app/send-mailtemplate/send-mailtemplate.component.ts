import { Component, OnInit, Inject } from '@angular/core';
import { MailTemplate } from '../models/MailTemplate';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { MailtemplateService } from '../services/mail-template/mailtemplate.service';
import { ToastrService } from 'ngx-toastr';
import { ExternalfirmsService } from '../services/externalfirms/externalfirms.service';
import { ExternalFirm } from '../models/ExternalFirm';
import { ReportService } from '../services/report.service';
import { MailService } from '../services/mail-service/mail-service.service';
import { Mail } from '../models/Mail';
import { CategoryService } from '../services/category.service';
import { Report } from '../models/Report';
import { FormControl } from '@angular/forms';
import { Observable } from 'rxjs';
import { startWith, map } from 'rxjs/operators';
import { Order } from '../models/Order';

@Component({
  selector: 'app-send-mailtemplate',
  templateUrl: './send-mailtemplate.component.html',
  styleUrls: ['./send-mailtemplate.component.css'],
})
export class SendMailtemplateComponent implements OnInit {
  template: MailTemplate;
  isLoaded: boolean;
  firmList: ExternalFirm[] = [];
  assignToFirmInformation: ExternalFirm;
  templates = [];
  reporterId: string;
  requesterId: string;
  id: string;
  public orderEmail: Mail = new Mail();
  public reportEmail: Mail = new Mail();
  public selectedFirm;
  public firm;
  report: Report;
  reportId: string;
  order: Order;
  orderId: string;
  Categories: string[] = [];
  public isGeaboneerd;
  UserID = localStorage.getItem('UserID');
  public floors: string[];
  public locaties: string[];
  meldingUrl: string;
  taakUrl: string;
  externalFirmId: string;
  idToken: string;
  isReport = false;
  isOrder: boolean;
  public isFirmSelected = false;

  constructor(@Inject(MAT_DIALOG_DATA) public data: any,
    // tslint:disable-next-line: max-line-length
              public dialogRef: MatDialogRef<SendMailtemplateComponent>, private mailTemplateService: MailtemplateService,
              private externalFirmService: ExternalfirmsService, private mailService: MailService, private toastr: ToastrService
               ) { }

  ngOnInit() {
    this.getTemplate();
    this.getAllFirms();
    this.meldingUrl = this.data.meldingUrl;
    this.taakUrl = this.data.taakUrl;
    this.externalFirmId = this.data.externalFirmId;
    this.getTokenForSelectedFirm();
    this.selectedFirm = this.data.selectedFirm;

    /**
     * This controls whether an order or report will be sent
     * It checks the URL to be sent to see whether it is of order or report
     * And then retrieve the required html content
     */
    if (this.data.id) {
      if(this.data.taakUrl === undefined) {
        this.isReport = true;
        this.mailTemplateService.getTemplate(this.data.id).subscribe((res: any) => {
          this.template = res;
          this.template.firmName = 'Beste ' + this.selectedFirm.displayName;
        });
      }
    } else {
      this.isReport = false;
      this.mailTemplateService.getTemplate(this.data.id).subscribe((res: any) => {
        this.template = res;
      });
    }
  }

  /**
   * This method fetches all external firms from the externalfirms collection
   * Each of the firms is saved into the 'assignToFirmInformation' variable
   * This makes it easy to relate to the firms individually
   * All the firms are also pushed into the firmList array variable
   */
  getAllFirms() {
    this.externalFirmService.getAllFirms().subscribe((res: any) => {
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
  }

  /**
   * This method gets an id token to allow the external firm have access to the forwarded report or order
   */
  getTokenForSelectedFirm() {
    this.externalFirmService.getFirmIdToken(this.externalFirmId).subscribe((res: any) => {
      this.idToken = res;
    });
  }

  /**
   * This method is responsible for fetching a specific template from the mailtemplates collection
   * The fetched data is stored in the 'template' variable
   */
  getTemplate() {
    this.mailTemplateService.getTemplate(this.data.id).subscribe((data: any) => {
      if (data !== null) {
        this.template = data;
        this.template.firmName = 'Beste ' + this.selectedFirm.displayName;
        console.log(this.template);
        this.isLoaded = true;
      } else {
        this.isLoaded = false;
      }
    });
  }

  /**
   * This method closes the dialog
   */
  closeDialog() {
    this.dialogRef.close(false);
  }


  /**
   * This method is responsible for forwarding reports to an external firm
   * The content of the mail is retrieved from the mail template
   * The mail has a body objects with properties receiver, hyperlink and content
   */
  reportSendMail() {
      // this.email.sender.name = localStorage.getItem('userName');
      this.reportEmail.receiver = this.selectedFirm.email;
      this.template.hyperlink = this.meldingUrl + '?token=' + this.idToken;
      this.reportEmail.content = 'Beste ' + this.selectedFirm.displayName + '\n' + this.template.body + '\n'
      + this.template.hyperlink + '\n' + this.template.signature;

      this.mailService.sendMail(this.reportEmail).subscribe(res => {
        this.toastr.success('E-mail wordt verzenden');
      });

      console.log(this.reportEmail);
  }

  /**
   * This method is responsible for forwarding orders to an external firm
   * The content of the mail is retrieved from the mail template
   * The mail has a body objects with properties receiver, hyperlink and content
   */
  orderSendMail() {
    // this.email.sender.name = localStorage.getItem('userName');
    this.orderEmail.receiver = this.selectedFirm.email;
    this.template.hyperlink = this.taakUrl + '?token=' + this.idToken;
    this.orderEmail.content = 'Beste ' + this.selectedFirm.displayName + '\n' + this.template.body + '\n'
    + this.template.hyperlink + '\n' + this.template.signature;

    this.mailService.sendMail(this.orderEmail).subscribe(res => {
      this.toastr.success('E-mail wordt verzenden');
    });

    console.log(this.orderEmail);
}
}
