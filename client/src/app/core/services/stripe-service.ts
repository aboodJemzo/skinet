import { inject, Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import {ConfirmationToken, loadStripe, Stripe, StripeAddressElement, StripeAddressElementOptions, StripeElements, StripePaymentElement} from '@stripe/stripe-js'
import { CartService } from './cart';
import { Cart } from '../../shared/models/cart';
import { first, firstValueFrom, map } from 'rxjs';
import { AccountService } from './account-service';


@Injectable({
  providedIn: 'root',
})
export class StripeService {
  baseUrl = environment.apiUrl;
  private cartService = inject(CartService)
  private accountService = inject(AccountService);
  private http = inject(HttpClient);
    //here we create an instance of stripe
  private stripePromise : Promise<Stripe |null>
  // here we create stripe elements
  private elements? : StripeElements;
  private addressElement? : StripeAddressElement;
  private paymentElement? : StripePaymentElement;

  constructor(){
    this.stripePromise = loadStripe(environment.stripePublicKey);// here we made the instance that we need
  }

  //we use asyn methods cuz stripe returns promises for most things

  getStripeInstance(){
    return this.stripePromise;
  }

  // here we initialize the stripe Elements
  async initializeElements(){
    if(!this.elements){
      const stripe = await this.getStripeInstance();
      if(stripe){
        const cart = await firstValueFrom(this.createOrUpdatePaymentIntent()) // we used the "firstValueFrom" to make to make the observable of "createOrUpdatePaymentIntent" to wait like any other promise
        this.elements = stripe.elements({clientSecret : cart.clientSecret , appearance : {labels:'floating'}})
      }
      else{
        throw new Error('Stripe has not been loaded')
      }
    }
    return this.elements;
  }

  async createPaymentElement(){
    if(!this.paymentElement){
      const elements = await this.initializeElements();
      if(elements){
        this.paymentElement = elements.create('payment');
      }
      else{
        throw new Error('Elements instance has not been initialized');
      }
    }
    return this.paymentElement;
  }

  async createAddressElement(){
    if(!this.addressElement){
      const elements = await this.initializeElements();
      if(elements){
        const user = this.accountService.currentUser();// we make some default values when we create the address element
        let defaultValues : StripeAddressElementOptions['defaultValues'] = {};

        if(user){
          defaultValues.name = user.firstName + ' ' + user.lastName;
        }

        if(user?.address){
          defaultValues.address ={
            line1 : user.address.line1,
            line2 : user.address.line2,
            city : user.address.city,
            state : user.address.state,
            country : user.address.country,
            postal_code : user.address.postalCode,
          }
        }

        const options: StripeAddressElementOptions={
          mode :'shipping',// here we used shipping cuz when the client goes to the payment option , he'll be asked if he wanna use the same address as the shipping address for his billing address
          //and if he says no to that then stripe asks him to proivde whatever info stripe needs to process their payment
          defaultValues
        };
        this.addressElement = elements.create('address',options);
      }
      else{
        throw new Error('Elements instance has not been loaded');
      }
    }
    return this.addressElement;
  }

  async createConfirmationToken(){
    const stripe = await this.getStripeInstance();
    const elements = await this.initializeElements();
    const result = await elements.submit();
    if(result.error) throw new Error(result.error.message);
    if(stripe){
      return await stripe.createConfirmationToken({elements});
    }
    else {
      throw new Error('Stripe not available');
    }
  }

  async confirmPayment(confirmationToken : ConfirmationToken){
    const stripe = await this.getStripeInstance();
    const elements = await this.initializeElements();
    const result = await elements.submit();
    if(result.error) throw new Error(result.error.message);

    const clientSecret = this.cartService.cart()?.clientSecret;

    if(stripe && clientSecret){
      return await stripe.confirmPayment({
        clientSecret : clientSecret,
        confirmParams :{
          confirmation_token : confirmationToken.id
        },
        redirect : 'if_required'
      });
    }
    else{
      throw new Error('Unable to loadt Stripe');
    }
  }
  createOrUpdatePaymentIntent(){
    const cart = this.cartService.cart();
    if(!cart) throw new Error('Problem with cart');
    return this.http.post<Cart>(this.baseUrl + 'payments/' + cart.id,{}).pipe(
      map(cart => {
        this.cartService.setCart(cart);//here we updated the redis cuz there may be some circumstances where it's possible that they'll create the payment so we update the redis that we will not lose the intent when they refresh the page
        return cart;
      })
    )
  }

  disposeElements(){
    this.elements = undefined;
    this.addressElement= undefined;
    this.paymentElement= undefined;
  }

}
