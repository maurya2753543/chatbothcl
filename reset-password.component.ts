import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms';
import { SessionService } from '../session.service';
import { Router, ActivatedRoute } from '@angular/router';
import { MatSnackBar } from '@angular/material';
import { AppLoaderService } from 'src/app/shared/services/app-loader/app-loader.service';
import { localStorageVariables, resetLocalStorage, appVariables, appSessionErr, appGenericErr, snackBarDuration } from 'src/app/app.constants';

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.scss']
})
export class ResetPasswordComponent implements OnInit {

  public resetPasswordForm: FormGroup;
  public userId = "";
  public passwordMatch = true
 // public invalidUser = '';
  
 constructor(
  private fb: FormBuilder,
  private sessionService: SessionService,
  private snackBar: MatSnackBar,
  private router: Router,
  private loader: AppLoaderService,
  private route: ActivatedRoute
 ) { }

  ngOnInit() {
    this.userId = this.route.snapshot.paramMap.get('userId');
    this.resetPasswordForm = this.fb.group({
      newPassword: new FormControl('', [Validators.required, Validators.minLength(8),Validators.maxLength(16)]),
      confirmPassword: new FormControl('', [Validators.required , Validators.minLength(8),Validators.maxLength(16)]),
      
    });
  }
  checkPassword(){
      let password = this.resetPasswordForm.get('newPassword').value;
      let confirmPassword = this.resetPasswordForm.get('confirmPassword').value;
      if(password != ''){
        if(confirmPassword != ''){
          if(confirmPassword == password){
            this.passwordMatch = true;
          }
          else{
            this.passwordMatch = false;
          }
        }else{
          this.passwordMatch = true;
        }
      }
    }
  resetPassword(){
    this.loader.open();
    let request = {
    userId: this.userId,
    password: this.resetPasswordForm.get('newPassword').value
    }
    this.sessionService.resetPassword(request)
    .subscribe(res => {
      this.snackBar.open('Password Set Successfully', 'OK', {duration: snackBarDuration}); 
      this.logout();
    }, err => {
      if(err.status == '401'){
        this.snackBar.open(appSessionErr, 'OK', {duration: snackBarDuration}); 
        resetLocalStorage();
        this.router.navigate([appVariables.loginPageUrl]);
      } 
      else{
        this.snackBar.open(appGenericErr, 'OK', {duration: snackBarDuration});
      }
      this.loader.close();
    })
  }

  logout(){
    this.loader.open();
    this.sessionService.logout()
    .subscribe( res => {
      this.loader.close();
      resetLocalStorage();
      this.router.navigate([appVariables.loginPageUrl]);
    }, err => {
      this.loader.close();
      if(err.status == '401'){
        this.snackBar.open(appSessionErr, 'OK', {duration: snackBarDuration}); 
        resetLocalStorage();
        this.router.navigate([appVariables.loginPageUrl]);
      } 
      else{
        this.snackBar.open(appGenericErr, 'OK', {duration: snackBarDuration});
      }
      this.loader.close();
    })
  }



}
