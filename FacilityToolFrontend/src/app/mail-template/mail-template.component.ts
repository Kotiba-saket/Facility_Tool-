import { Component, OnInit } from '@angular/core';
import { MailtemplateService } from '../services/mail-template/mailtemplate.service';
import { MailTemplate } from '../models/MailTemplate';

@Component({
  selector: 'app-mail-template',
  templateUrl: './mail-template.component.html',
  styleUrls: ['./mail-template.component.css']
})
export class MailTemplateComponent implements OnInit {
  templates = [];
  isLoaded: boolean;
  template: MailTemplate;
  id: string;
  firmName: string;

  isEditable = true;
  constructor(private mailTemplateService: MailtemplateService) { }

  ngOnInit() {
    this.getAllTemplates();
  }

  /**
   * This method fetches one template from the database depending on the id
   * The fetched data is stored in the variable template
   */
  getTemplate() {
    this.mailTemplateService.getTemplate(this.id).subscribe((res: any) => {
      if (res !== null) {
      this.template = res;
      this.isLoaded = true;
      } else {
        this.isLoaded = false;
      }
    });
  }

  /**
   * This method fetches all mail templates from the database and saves it in the templates[] array;
   */
  getAllTemplates() {
    this.mailTemplateService.getAllTemplates().subscribe((res: any) => {
      this.templates = res;
    });
  }

  /**
   * This method is responsible for updating a mail template
   */
  updateTemplate() {
    this.mailTemplateService.updateTemplate(this.template).subscribe(res => {
      location.reload();
    });
  }
}
