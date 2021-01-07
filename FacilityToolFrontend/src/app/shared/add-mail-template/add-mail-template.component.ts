import { Component, Inject } from '@angular/core';
import { MailTemplate } from '../../models/MailTemplate';
import { MailtemplateService } from '../../services/mail-template/mailtemplate.service';
import { ToastrService } from 'ngx-toastr';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';

@Component({
  selector: 'app-add-mail-template',
  templateUrl: './add-mail-template.component.html',
  styleUrls: ['./add-mail-template.component.css'],
})
export class AddMailTemplateComponent {
  public template: MailTemplate = new MailTemplate();
  isLoaded: boolean;
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialogRef: MatDialogRef<AddMailTemplateComponent>,
    private mailTemplateService: MailtemplateService,
    private toastr: ToastrService
  ) {}


  /**
   * This method is responsible creating a new mail template
   */
  addTemplate() {
    this.mailTemplateService.createTemplate(this.template).subscribe((res) => {
      this.toastr.success('Bedankt !', 'Template wordt toegevoegd.');
      location.reload();
    });
  }

  /**
   * This method closes an opened dialog when called
   */
  closeDialog() {
    this.dialogRef.close(false);
  }
}
