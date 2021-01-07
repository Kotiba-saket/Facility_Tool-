import { Component, OnInit, Inject } from '@angular/core';
import { CategoryService } from 'src/app/services/category.service';
import { ToastrService } from 'ngx-toastr';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';

@Component({
  selector: 'app-category-modal',
  templateUrl: './category-modal.component.html',
  styleUrls: ['./category-modal.component.css']
})
export class CategoryModalComponent {
  newCategory: string;
  constructor(private categoryService: CategoryService,
              private toastr: ToastrService,
              public dialogRef: MatDialogRef<CategoryModalComponent>,
              @Inject(MAT_DIALOG_DATA) public data: any) { }

  /**
   * This method is responsible for adding a new category to an existing department
   */
  addCategory(): void {
    this.categoryService.newDepartment(this.newCategory)
    .subscribe(res => {
      this.toastr.success('De categorie werd toevoegd!', 'Bedankt!');
    });
    this.closeDialog();
    location.reload();
  }

  /**
   * This method closes an opened dialog when called
   */
  closeDialog() {
    this.dialogRef.close(false);
  }
}
