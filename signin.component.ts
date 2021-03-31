import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, FormBuilder, Validators } from '@angular/forms';
import { SessionService } from '../session.service';
import { MatDialog, MatSnackBar } from "@angular/material";
import { localStorageVariables, appSessionErr, appGenericErr, appVariables, resetLocalStorage, snackBarDuration } from '../../../app.constants';
import { Router } from '@angular/router';
import { AppLoaderService } from '../../../shared/services/app-loader/app-loader.service';
import { ChatService } from 'src/app/services/chat/chat.service';
import { ChatbotdialogComponent } from 'src/app/chatbotdialog/chatbotdialog.component';

@Component({
  selector: 'app-signin',
  templateUrl: './signin.component.html',
  styleUrls: ['./signin.component.scss']
})
export class SigninComponent implements OnInit {

  public signinForm: FormGroup;
  public invalidUser = '';

  constructor(
    private fb: FormBuilder,
    private sessionService: SessionService,
    private snackBar: MatSnackBar,
    private router: Router,
    private loader: AppLoaderService,
    public dialog: MatDialog,
    private chatservice:ChatService
  ) { }

  ngOnInit() {
    this.signinForm = this.fb.group({
      username: new FormControl('', [Validators.required]),
      password: new FormControl('', Validators.required),
      grant_type: new FormControl('password')
    });
  }

  signIn(){
    this.loader.open();
    let data = 'username=' + this.signinForm.get('username').value + '&password=' + this.signinForm.get('password').value + '&grant_type=' + this.signinForm.get('grant_type').value;
    this.sessionService.login(data)
    .subscribe(res => {
      if(res == 'ERROR'){
        this.snackBar.open(appGenericErr, 'OK', {duration: snackBarDuration});
      } else{
      this.invalidUser = '';
      resetLocalStorage();
      localStorage.setItem(localStorageVariables.AuthInfo, JSON.stringify(res));
      this.routeUser(res);
      }
    }, err => {
      if(err.status == '401'){
        this.invalidUser = '';
        this.snackBar.open(appSessionErr, 'OK', {duration: snackBarDuration}); 
        resetLocalStorage();
        this.router.navigate([appVariables.loginPageUrl]);
      } else if(err.status == '400'){
        this.invalidUser = 'Invalid Username or Password.'
      }
      else{
        this.invalidUser = '';
        this.snackBar.open(appGenericErr, 'OK', {duration: snackBarDuration});
      }
      this.loader.close();
    })
  }

  routeUser(user){
    this.loader.open();
    let role = user.userDetail.authorities[0].authority ;
    if(role == 'ADMIN'){
      //this.loader.close();
      this.router.navigate(['/admin']);
    }
    else if(role == 'AGENT'){
      if(user.isPasswordReset){
      this.router.navigate(['/quiz']);
      }
      else{
        this.loader.close();
        this.router.navigate(['/resetPassword',user.userDetail.username]);
      }
    }
  }

  openDialog(): void {
    const dialogRef = this.dialog.open(ChatbotdialogComponent, {
      width: '390px',
      height: '620px',
      
     
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
     
    
    });
   

  }
 

}
