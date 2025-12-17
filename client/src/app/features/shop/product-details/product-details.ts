import { ChangeDetectorRef, Component, inject, OnInit } from '@angular/core';
import { shopService } from '../../../core/services/shop';
import { ActivatedRoute } from '@angular/router';
import { Product } from '../../../shared/models/product';
import { CurrencyPipe } from '@angular/common';
import { MatButton } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import { MatFormField, MatLabel } from '@angular/material/select';
import { MatInput } from '@angular/material/input';
import { MatDivider } from "@angular/material/divider";
import { CartService } from '../../../core/services/cart';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-product-details',
  imports: [
    CurrencyPipe,
    MatButton,
    MatIcon,
    MatFormField,
    MatInput,
    MatLabel,
    MatDivider,
    FormsModule
],
  templateUrl: './product-details.html',
  styleUrl: './product-details.scss',
})
export class ProductDetails implements OnInit{
  private shopService = inject(shopService);
  private activatedRoute = inject(ActivatedRoute);
  private cdr = inject(ChangeDetectorRef);
  private cartService = inject(CartService)
  product?:Product;
  quantityInCart = 0;
  quantity =1;

  ngOnInit(): void {
    this.loadProduct();
  }

  loadProduct(){
    const id = this.activatedRoute.snapshot.paramMap.get('id');// we used id in the approutes so we use it here to get the id
    if(!id) return;
    this.shopService.getProduct(+id).subscribe({
      next: product => {this.product= product
        this.updateQuantityInCart()
        this.cdr.detectChanges()},
      error : error => console.log(error)
    })
  }

  updateCart(){
    if(!this.product)return;
    if(this.quantity > this.quantityInCart){
      const itemsToAdd = this.quantity - this.quantityInCart;
      this.quantityInCart += itemsToAdd;
      this.cartService.addItemToCart(this.product,itemsToAdd);
    }
    else{
      const itemsToRemove = this.quantityInCart - this.quantity;
      this.quantityInCart -=itemsToRemove;
      this.cartService.removeItemFromCart(this.product.id,itemsToRemove)
    }
  }

  updateQuantityInCart(){
    this.quantityInCart = this.cartService.cart()?.items.
    find(x => x.productId === this.product?.id)?.quantity || 0;
    this.quantity = this.quantityInCart || 1;
  }

  getButtonText(){
    return this.quantityInCart > 0 ? 'Update cart' : 'Add to cart'
  }
}
