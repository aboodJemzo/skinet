import { inject, Injectable } from '@angular/core';
import { CartService } from './cart';
import { of } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class InitService {
  private cartService = inject(CartService);

  init(){// we need to return an obervable otherwise the app initializer will not wait for the result of this
    const cartId = localStorage.getItem('cart_id'); // the idea of this app initializer , that  it needs to wait for the result of us going out to get our cart
    const cart$ = cartId ? this.cartService.getCart(cartId) : of(null);

    return cart$;
  }
}
