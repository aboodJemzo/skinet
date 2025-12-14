import { inject, Injectable } from '@angular/core';
import{MatSnackBar} from '@angular/material/snack-bar'

@Injectable({
  providedIn: 'root',
})
export class Snackbar {
  private snackbar = inject(MatSnackBar)

  error(message:string){
    this.snackbar.open(message,'Close',{//"it's like(message,action,config)"
      duration:5000,
      panelClass:['snack-error']//this we can use in the style.css to style this particular snackbar
    })
  }

  success(message:string){
    this.snackbar.open(message,'Close',{
      duration:5000,
      panelClass:['snack-success']
    })
  }

}
