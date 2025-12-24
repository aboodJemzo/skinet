import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { MatButton } from '@angular/material/button';
import { MatCard } from '@angular/material/card';
import { MatInput } from '@angular/material/input';
import { MatFormField, MatLabel } from '@angular/material/select';
import { AccountService } from '../../../core/services/account-service';
import { ActivatedRoute, Router } from '@angular/router';
import { CdkAriaLive } from "../../../../../node_modules/@angular/cdk/types/_a11y-module-chunk";

@Component({
  selector: 'app-login',
  imports: [
    ReactiveFormsModule,
    MatCard,
    MatFormField,
    MatInput,
    MatLabel,
    MatButton
],
  templateUrl: './login.html',
  styleUrl: './login.scss',
})
export class Login {
  private fb = inject(FormBuilder);
  private accountservice = inject(AccountService);
  private router = inject(Router);
  private activatedRoute = inject(ActivatedRoute);
  returnUrl = '/shop';

  constructor() {
    const url = this.activatedRoute.snapshot.queryParams['returnUrl'];
    if(url)
      this.returnUrl = url;
  }

  loginForm = this.fb.group({
    email :[''],
    password : ['']
  })

  onSubmit(){
    this.accountservice.login(this.loginForm.value).subscribe({
      next : () =>{
        this.accountservice.getUserInfo().subscribe();
        this.router.navigateByUrl(this.returnUrl);
      }
    })
  }
}
