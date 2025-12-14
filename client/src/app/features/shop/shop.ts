import { Component, inject, OnInit, signal } from '@angular/core';
import { Product } from '../../shared/models/product';
import { shopService } from '../../core/services/shop';
import{MatCard} from '@angular/material/card';
import{MatDialog} from '@angular/material/dialog';
import { ProductItem } from './product-item/product-item';
import { FiltersDialog } from './filters-dialog/filters-dialog';
import { MatButton, MatIconButton } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import { MatMenu, MatMenuTrigger } from '@angular/material/menu';
import { MatListOption, MatSelectionList, MatSelectionListChange } from '@angular/material/list';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { ShopParams } from '../../shared/models/shopParams';
import { Pagination } from '../../shared/models/pagination';
import { ChangeDetectorRef } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-shop',
  imports: [
    ProductItem,
    MatButton,
    MatIcon,
    MatMenu,
    MatSelectionList,
    MatListOption,
    MatMenuTrigger,
    MatPaginator,
    FormsModule,
    MatIconButton
],
  templateUrl: './shop.html',
  styleUrl: './shop.scss',
})
export class Shop implements OnInit{
  private shopService = inject(shopService);
  private dialogService = inject(MatDialog);
  private cdr = inject(ChangeDetectorRef);
  protected readonly title = signal('Skinet');
  products ?: Pagination<Product>;
  sortOptions = [
    {name : 'Alphabetical',value :'name'},
    {name : 'Price: Low-High',value :'priceAsc'},
    {name : 'Price: High-Low',value :'priceDesc'}
  ]
  shopParams = new ShopParams();
  pageSizeOptions = [5,10,15,20]

  ngOnInit(): void {
    this.initializeShop()
  }
  initializeShop(){
    this.shopService.getBrands();
    this.shopService.getTypes();
    this.getProducts();
  }

  getProducts(){
    this.shopService.getProducts(this.shopParams).subscribe({
      next: response => {this.products = response;
        this.cdr.detectChanges();
      },
      error : error => console.log(error)
    })
  }

  onSearchChange(){
    this.shopParams.pageNumber=1;
    this.getProducts();
  }

  handlePageEven(event : PageEvent){
    this.shopParams.pageNumber = event.pageIndex + 1;
    this.shopParams.pageSize = event.pageSize;
    this.getProducts();
  }

  onSortChange(event:MatSelectionListChange){
    const selectedOption = event.options[0];
    if(selectedOption){
      this.shopParams.sort = selectedOption.value;
      this.shopParams.pageNumber = 1;
      this.getProducts();
    }
  }

  openFiltersDialog(){
    const dialogRef = this.dialogService.open(FiltersDialog,{
      minWidth : '500px',
      data:{
        selectedBrands : this.shopParams.brands,
        selectedTypes : this.shopParams.types,
      }
    });
    dialogRef.afterClosed().subscribe({
      next : result =>{
        if(result){
          this.shopParams.brands = result.selectedBrands;
          this.shopParams.types = result.selectedTypes;
          this.shopParams.pageNumber=1;
          //apply Filters
          this.getProducts();
        }
      }
    })
  }

}
