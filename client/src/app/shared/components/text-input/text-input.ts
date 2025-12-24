import { Component, Input, input, Self } from '@angular/core';
import { ControlValueAccessor, FormControl, NgControl, ReactiveFormsModule } from '@angular/forms';
import { MatInput } from '@angular/material/input';
import { MatError, MatFormField, MatLabel } from '@angular/material/select';

@Component({
  selector: 'app-text-input',
  imports: [
    ReactiveFormsModule,
    MatFormField,
    MatInput,
    MatError,
    MatLabel
  ],
  templateUrl: './text-input.html',
  styleUrl: './text-input.scss',
})
export class TextInput implements ControlValueAccessor{
  @Input() label = '';
  @Input() type = 'text';

  constructor(@Self() public controlDir:NgControl){// our form controls that we create Get bound to a DOM element in the HTML
    //the idea here is , that services that we inject here or anything that we inject into angular components, it's gonna attempts to reuse them if they've been used before
    //but when it comes to a form input ,then we do not wanna reuse something that's been used for another input we want individual unique instances of this
    //so this Control "NgControl" that we r injecting into this, it's gonna represent a single input and we're not reusing something that's already in use somewhere else on our form
    // and the "@Self" prevent the "NgControl" from reusing another control directive that we r injecting somewhere else

      this.controlDir.valueAccessor = this;
  }
  writeValue(obj: any): void {
  }
  registerOnChange(fn: any): void {
  }
  registerOnTouched(fn: any): void {
  }

  get control(){
    return this.controlDir.control as FormControl
  }

}
