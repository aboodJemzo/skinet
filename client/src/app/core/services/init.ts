import { inject, Injectable } from '@angular/core';
import { CartService } from './cart';
import { forkJoin, of } from 'rxjs';
import { AccountService } from './account-service';

@Injectable({
  providedIn: 'root',
})
export class InitService {
  private cartService = inject(CartService);
  private accountservice = inject(AccountService);

  init(){// we need to return an obervable otherwise the app initializer will not wait for the result of this
    const cartId = localStorage.getItem('cart_id'); // the idea of this app initializer , that  it needs to wait for the result of us going out to get our cart
    const cart$ = cartId ? this.cartService.getCart(cartId) : of(null);

    return forkJoin({ // this method allows us to wait for multipale observable to complete and then emit their latest values as an array
      cart: cart$,
      user : this.accountservice.getUserInfo(),
    });
  }
}
