import { Component, OnInit, Inject, HostListener } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { MatConfirmDialogComponent } from '../mat-confirm-dialog/mat-confirm-dialog.component';
import { ExternalFirm } from '../models/ExternalFirm';
import { ExternalfirmsService } from '../services/externalfirms/externalfirms.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-create-external-firm-dialog',
  templateUrl: './create-external-firm-dialog.component.html',
  styleUrls: ['./create-external-firm-dialog.component.css']
})


export class CreateExternalFirmDialogComponent implements OnInit {

/**
 * Variables
 */
editFirm:boolean = false;
public newExternalFirm: ExternalFirm = new ExternalFirm();
public externalFirm: ExternalFirm;

  constructor(@Inject(MAT_DIALOG_DATA) public data,
  public dialogRef: MatDialogRef<MatConfirmDialogComponent>, private externalfirmsService: ExternalfirmsService,private toastr: ToastrService) { }

ngOnInit() {
  if(this.data.FirmId) {
    this.editFirm= true;
    this.externalfirmsService.getFirmById(this.data.FirmId).subscribe(res => {
      this.externalFirm = res;
  });
}

}

/**
 * het dialog wordt dicht wanneer op cancel knop wordt geklikt
 */
closeDialog() {
this.dialogRef.close(false);
}


/**
 * we sturen hier een object van informatie over new firm als parameter naar de functie in het service om new external firm te creeeren
 */
addFirm() {
  this.externalfirmsService.addFirm(this.newExternalFirm).subscribe(res => {
    console.log(res);
    this.toastr.success('Firm Added succefully');
  });
  location.reload();
}


/**
 * dit methode wordt gebruikt om een external firm te updaten
 * @param firmId dit is id parameter, wordt doorgesturd naar functie in het service om het gevraagde external firm te vinden.
 */
updateFirm(firmId) {
  this.externalfirmsService.updateFirm(this.externalFirm, firmId).subscribe(res => {
    console.log(res);
    console.log('firm updated succefully');
  });
  location.reload();
}

}
