import { Component, inject, OnDestroy, OnInit, signal } from '@angular/core';
import { OrderSummary } from "../../shared/components/order-summary/order-summary";
import {MatStepper, MatStepperModule} from '@angular/material/stepper';
import { Router} from "@angular/router";
import { MatButton } from "@angular/material/button";
import { StripeService } from '../../core/services/stripe-service';
import { Snackbar } from '../../core/services/snackbar';
import { ConfirmationToken, StripeAddressElement, StripeAddressElementChangeEvent, StripePaymentElement, StripePaymentElementChangeEvent } from '@stripe/stripe-js';
import { MatCheckboxChange, MatCheckboxModule} from '@angular/material/checkbox';
import { StepperSelectionEvent } from '@angular/cdk/stepper';
import { Address } from '../../shared/models/user';
import { AccountService } from '../../core/services/account-service';
import { firstValueFrom } from 'rxjs';
import { CheckoutDelivery } from "./checkout-delivery/checkout-delivery";
import { CheckoutReview } from "./checkout-review/checkout-review";
import { CartService } from '../../core/services/cart';
import { CurrencyPipe, JsonPipe } from '@angular/common';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';

@Component({
  selector: 'app-checkout',
  imports: [
    OrderSummary,
    MatStepperModule,
    MatButton,
    MatCheckboxModule,
    CheckoutDelivery,
    CheckoutReview,
    CurrencyPipe,
    MatProgressSpinnerModule,
    JsonPipe // we used this to display the object "completionStatus" so we need the JsonPipe
],
  templateUrl: './checkout.html',
  styleUrl: './checkout.scss',
})
export class Checkout implements OnInit , OnDestroy {
  private stripeService = inject(StripeService);
  private accountService = inject(AccountService)
  private router = inject(Router)
  private snackbar = inject(Snackbar);
  cartService = inject(CartService);
  addressElement? : StripeAddressElement;
  paymentElement?: StripePaymentElement;
  saveAddress=false;
  completionStatus = signal<{address : boolean , card : boolean , delivery : boolean}>(// we r gonna use thiss to track the completion status
    {address : false , card: false , delivery : false}
  );// we used the signal to track what's going on when this completion status object is updated
  confirmationTokent?: ConfirmationToken;
  loading = signal(false);

  async ngOnInit() {
    try{
      this.addressElement = await this.stripeService.createAddressElement();
      this.addressElement.mount('#address-element'); //here we mount the element in the html that has the same ID of this mount
      this.addressElement.on('change', this.handleAddressChange)// here to handle the status of the address and track it

      this.paymentElement= await this.stripeService.createPaymentElement();
      this.paymentElement.mount('#payment-element')
      this.paymentElement.on('change',this.handlePaymentChange)
    }
    catch(error : any){
      this.snackbar.error(error.message);
    }
  }

  handleAddressChange = (event : StripeAddressElementChangeEvent) => {// here to handle the status of the address and track it
    this.completionStatus.update(state =>{
      state.address = event.complete;
      return state;
    })
  }

  handlePaymentChange = (event : StripePaymentElementChangeEvent) => {// here to handle the status of the address and track it
    this.completionStatus.update(state =>{
      state.card = event.complete;
      return state;
    })
  }

  handleDeliveryChange(event : boolean){// we use a normal func cuz we dont use it inside our "async ngOnInit()" as part of change event already inside this component
    this.completionStatus.update( state =>{
      state.delivery =event;
      return state;
    })
  }

  async getConfirmationToken(){
    try{
      if(Object.values(this.completionStatus()).every(status => status === true)){ // here we check if all the values inside the completion status object are true
        const result = await this.stripeService.createConfirmationToken();
        if(result.error) throw new Error(result.error.message);
        this.confirmationTokent = result.confirmationToken;
        console.log(this.confirmationTokent)
      }
    }
    catch(error :any){
      this.snackbar.error(error.message);
    }
  }

  async onStepChange(event : StepperSelectionEvent){
    if(event.selectedIndex === 1){
      if(this.saveAddress){
        const address = await this.getAddressFromStripeAddress();
        address && firstValueFrom(this.accountService.updateAddress(address));
      }
    }
    if(event.selectedIndex === 2){
      await firstValueFrom(this.stripeService.createOrUpdatePaymentIntent())
    }
    if(event.selectedIndex === 3){
      await this.getConfirmationToken();
    }
  }

  async confirmPayment(stepper : MatStepper){
    this.loading.set(true);
    try {
      if(this.confirmationTokent){
        const result = await this.stripeService.confirmPayment(this.confirmationTokent);
        if(result.error) {
          throw new Error(result.error.message);
        }
        else{
          this.cartService.deleteCart();
          this.cartService.selectedDelivery.set(null);
          this.router.navigateByUrl('/checkout/success');
        }
      }

    } catch (error : any) {
      this.snackbar.error(error.message || 'Something went wrong');
      stepper.previous();
    }
    finally{
      this.loading.set(false);
    }
  }

  private async  getAddressFromStripeAddress(): Promise<Address | null> {
    const result = await this.addressElement?.getValue();
    const address = result?.value.address;

    if(address){
      return{
        line1 : address.line1,
        line2 : address.line2 || undefined,
        city : address.city,
        state : address.state,
        country : address.country,
        postalCode : address.postal_code,
      }
    }
    else return null;
  }

  onSaveAddressCheckboxChange(event : MatCheckboxChange){
    this.saveAddress = event.checked;
  }

  ngOnDestroy(): void {
    this.stripeService.disposeElements();
  }

}
