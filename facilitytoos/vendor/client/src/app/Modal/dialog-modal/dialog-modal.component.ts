import { Component, OnInit } from '@angular/core';
import { MatBottomSheetRef } from '@angular/material';
import { AuthService } from 'src/app/auth-service/auth.service';


@Component({
  selector: 'app-dialog-modal',
  templateUrl: './dialog-modal.component.html',
  styleUrls: ['./dialog-modal.component.css']
})
export class DialogModalComponent   {
  GroupNames: any;
  returnValue: boolean;
  constructor(private _bottomSheetRef: MatBottomSheetRef<DialogModalComponent>, public authService: AuthService) {}

  openLink(event: MouseEvent): void {
    this._bottomSheetRef.dismiss();
    event.preventDefault();

  }

}
