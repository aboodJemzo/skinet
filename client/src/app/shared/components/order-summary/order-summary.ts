import { Component, inject } from '@angular/core';
import { CdkAriaLive } from "../../../../../node_modules/@angular/cdk/types/_a11y-module-chunk";
import { MatButton } from '@angular/material/button';
import { RouterLink } from '@angular/router';
import { MatFormField, MatLabel } from '@angular/material/select';
import { MatInput } from '@angular/material/input';
import { CartService } from '../../../core/services/cart';
import { CurrencyPipe } from '@angular/common';

@Component({
  selector: 'app-order-summary',
  imports: [
    MatButton,
    RouterLink,
    MatFormField,
    MatLabel,
    MatInput,
    CurrencyPipe
  ],
  templateUrl: './order-summary.html',
  styleUrl: './order-summary.scss',
})
export class OrderSummary {
  cartService = inject(CartService);
}
