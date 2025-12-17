import { Component, inject, Input } from '@angular/core';
import { Product } from '../../../shared/models/product';
import{ MatCard, MatCardContent, MatCardActions } from '@angular/material/card';
import { CdkAriaLive } from "../../../../../node_modules/@angular/cdk/types/_a11y-module-chunk";
import { CurrencyPipe } from '@angular/common';
import { MatButton } from '@angular/material/button';
import { MatIcon } from "@angular/material/icon";
import { RouterLink } from '@angular/router';
import { CartService } from '../../../core/services/cart';
import { CdkAutofill } from "@angular/cdk/text-field";

@Component({
  selector: 'app-product-item',
  imports: [
    MatCard,
    MatCardContent,
    CurrencyPipe,
    MatCardActions,
    MatButton,
    MatIcon,
    RouterLink,
],
  templateUrl: './product-item.html',
  styleUrl: './product-item.scss',
})
export class ProductItem {
  @Input() product?: Product;
  cartService = inject(CartService);
}
