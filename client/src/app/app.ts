import { Component, inject, OnInit, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Header } from "./layout/header/header";
import { HttpClient } from '@angular/common/http';
import { Product } from './shared/models/product';
import { Pagination } from './shared/models/pagination';
import { NgForOf } from "../../node_modules/@angular/common/types/_common_module-chunk";
import { Shop as Shop } from "./features/shop/shop";

@Component({
  selector: 'app-root',
  imports: [Header, Shop],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App {
  protected readonly title = signal('Skinet');
}
