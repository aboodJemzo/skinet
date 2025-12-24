import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButton } from '@angular/material/button';
import { MatCard } from '@angular/material/card';
import { MatInput } from '@angular/material/input';
import { MatError, MatFormField, MatLabel } from '@angular/material/select';
import { AccountService } from '../../../core/services/account-service';
import { Router } from '@angular/router';
import { Snackbar } from '../../../core/services/snackbar';
import { JsonPipe } from '@angular/common';
import { TextInput } from "../../../shared/components/text-input/text-input";

@Component({
  selector: 'app-register',
  imports: [
    ReactiveFormsModule,
    MatCard,
    MatLabel,
    MatFormField,
    MatInput,
    MatButton,
    JsonPipe,
    MatError,
    TextInput
],
  templateUrl: './register.html',
  styleUrl: './register.scss',
})
export class Register {
  private fb = inject(FormBuilder);
  private accountservice = inject(AccountService);
  private router = inject(Router);
  private snack = inject(Snackbar)
  validationErrors?: string[];

  registerForm = this.fb.group({
    firstName : ['',Validators.required],
    lastName : ['',Validators.required],
    email : ['',[Validators.required,Validators.email]],
    password : ['',Validators.required],
  })

  onSubmit(){
    this.accountservice.register(this.registerForm.value).subscribe({
      next : () =>{
        this.snack.success('Registeration successful - you can now login');
        this.router.navigateByUrl('/account/login')
      },
      error : errors => this.validationErrors = errors
    })
  }

}
