import { Component, inject, OnInit, output } from '@angular/core';
import { CheckoutService } from '../../../core/services/checkout-service';
import {MatRadioModule} from '@angular/material/radio';
import { CommonModule,CurrencyPipe } from '@angular/common';
import { CartService } from '../../../core/services/cart';
import { DeliveryMethod } from '../../../shared/models/deliveryMethod';

@Component({
  selector: 'app-checkout-delivery',
  imports: [
    CommonModule,
    MatRadioModule,
    CurrencyPipe
  ],
  templateUrl: './checkout-delivery.html',
  styleUrl: './checkout-delivery.scss',
})
export class CheckoutDelivery implements OnInit{
  checkoutService = inject(CheckoutService)
  cartService = inject(CartService);
  deliveryComplete = output<boolean>();// we use this prop to affect a prop of the parent
  // and to use this output prop in the parent we need to do something in our checkout component template.

  ngOnInit(): void {
    this.checkoutService.getDeliveryMethods().subscribe({
      next : methods => {
        if(this.cartService.cart()?.deliveryMethodId){
          const method = methods.find(x => x.id === this.cartService.cart()?.deliveryMethodId);
          if(method){
            this.cartService.selectedDelivery.set(method);
            this.deliveryComplete.emit(true);// here we updated the status of it
          }
        }
      }
    });
  }

  updateDeliveryMethod(method : DeliveryMethod){
    this.cartService.selectedDelivery.set(method);
    const cart = this.cartService.cart();
    if(cart){
      cart.deliveryMethodId = method.id;
      this.cartService.setCart(cart);//this will also update the redis DB
      this.deliveryComplete.emit(true);// here we updated the status of it
    }
  }
}
