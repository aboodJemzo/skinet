import { Component, effect, inject } from '@angular/core';
import{MatIcon} from '@angular/material/icon';
import{MatButton} from '@angular/material/button';
import{MatBadge} from '@angular/material/badge'
import{MatProgressBar} from '@angular/material/progress-bar'
import { RouterLink, RouterLinkActive } from "@angular/router";
import { Busy } from '../../core/services/busy';
import { CartService } from '../../core/services/cart';

@Component({
  selector: 'app-header',
  imports: [
    MatIcon,
    MatButton,
    MatBadge,
    RouterLink,
    RouterLinkActive,
    MatProgressBar
],
  templateUrl: './header.html',
  styleUrl: './header.scss',
})
export class Header {
  busyService = inject(Busy)
  cartService = inject(CartService);
  constructor() {
    // 🔴 THIS IS THE MAGIC LINE
    effect(() => {
      this.busyService.loading();
    });
  }
}
