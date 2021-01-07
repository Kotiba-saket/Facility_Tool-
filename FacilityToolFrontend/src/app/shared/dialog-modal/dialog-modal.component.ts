import { Component, OnInit } from '@angular/core';
import { MatBottomSheetRef } from '@angular/material';
import { AuthService } from 'src/app/auth-service/auth.service';

@Component({
  selector: 'app-dialog-modal',
  templateUrl: './dialog-modal.component.html',
  styleUrls: ['./dialog-modal.component.css'],
})
export class DialogModalComponent {
  GroupNames: any;
  returnValue: boolean;
  constructor(
    private bottomSheetRef: MatBottomSheetRef<DialogModalComponent>,
    public authService: AuthService
  ) {}

  /**
   * This method opens a dialog with options to either create a report or order
   * @param event the option selected
   */
  openLink(event: MouseEvent): void {
    this.bottomSheetRef.dismiss();
    event.preventDefault();
  }
}
