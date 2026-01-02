import { inject, Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { DeliveryMethod } from '../../shared/models/deliveryMethod';
import { map, of } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class CheckoutService {
  baseUrl = environment.apiUrl;
  private http = inject(HttpClient);
  deliveryMethods : DeliveryMethod[] = [];

  getDeliveryMethods(){
    if(this.deliveryMethods.length > 0) return of(this.deliveryMethods);// here we used "of" to return an observable
    return this.http.get<DeliveryMethod[]>(this.baseUrl + 'payments/delivery-methods').pipe(
      map(methods =>{
        this.deliveryMethods = methods.sort((a,b) => b.price - a.price); // here we sort the methods in highest price method first
        return methods;
      })
    )
  }
}
