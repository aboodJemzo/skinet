import { Component, inject } from '@angular/core';
import { shopService } from '../../../core/services/shop';
import{MatDivider} from '@angular/material/divider'
import{MatListOption, MatSelectionList} from '@angular/material/list'
import { MatButton } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { FormsModule } from '@angular/forms';
import { CdkObserveContent } from "@angular/cdk/observers";

@Component({
  selector: 'app-filters-dialog',
  imports: [
    MatDivider,
    MatSelectionList,
    MatListOption,
    MatButton,
    FormsModule,
],
  templateUrl: './filters-dialog.html',
  styleUrl: './filters-dialog.scss',
})
export class FiltersDialog {
  shopService = inject(shopService)
  private dialogRef = inject(MatDialogRef<FiltersDialog>);
  data = inject(MAT_DIALOG_DATA);

  selectedBrands:string[] = this.data.selectedBrands;
  selectedTypes:string[] = this.data.selectedTypes;

  applyFilters(){
    this.dialogRef.close({
      selectedBrands : this.selectedBrands,
      selectedTypes: this.selectedTypes
    })
  }
}
