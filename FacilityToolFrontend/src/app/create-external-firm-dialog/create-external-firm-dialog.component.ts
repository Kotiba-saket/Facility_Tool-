import { Component, OnInit, Inject, HostListener } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { MatConfirmDialogComponent } from '../shared/mat-confirm-dialog/mat-confirm-dialog.component';
import { ExternalFirm } from '../models/ExternalFirm';
import { ExternalfirmsService } from '../services/externalfirms/externalfirms.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-create-external-firm-dialog',
  templateUrl: './create-external-firm-dialog.component.html',
  styleUrls: ['./create-external-firm-dialog.component.css'],
})
export class CreateExternalFirmDialogComponent implements OnInit {
  /**
   * Variables
   */
  editFirm = false;
  public newExternalFirm: ExternalFirm = new ExternalFirm();
  public externalFirm: ExternalFirm;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data,
    public dialogRef: MatDialogRef<MatConfirmDialogComponent>,
    private externalfirmsService: ExternalfirmsService,
    private toastr: ToastrService
  ) {}

  ngOnInit() {
    if (this.data.FirmId) {
      this.editFirm = true;
      this.externalfirmsService
        .getFirmById(this.data.FirmId)
        .subscribe((res: any) => {
          this.externalFirm = res;
        });
    }
  }

  /**
   * This method closes the opened dialog
   */
  closeDialog() {
    this.dialogRef.close(false);
  }

  /**
   * This method is responsible for adding a new firm to our catalog.
   * It needs an object body to be sent to the backend to add a firm to the database
   */
  addFirm() {
    this.externalfirmsService.addFirm(this.newExternalFirm).subscribe((res) => {
      this.toastr.success('Externe firma is toegevoegd.');
    });
    location.reload();
  }

  /**
   * This method is responsible for updating an existing firm
   * @param firmId the id of the firm is needed in order to call the exact firm
   * want to update from the database
   */
  updateFirm(firmId) {
    this.externalfirmsService
      .updateFirm(this.externalFirm, firmId)
      .subscribe((res) => {});
    location.reload();
  }
}
