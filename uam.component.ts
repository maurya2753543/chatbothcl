import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { AdminService } from '../admin.service';
import { MatSnackBar } from "@angular/material";
import { FormGroup, Validators, FormBuilder } from '@angular/forms';
import { appGenderList, appLocationList, appSessionErr, appGenericErr, appUserStatus, appVariables, digitPattern, resetLocalStorage, localStorageVariables, stringPattern, subBandPattern, snackBarDuration } from '../../../app.constants';
import { DatePipe } from '@angular/common';
import { AppLoaderService } from '../../../shared/services/app-loader/app-loader.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-uam',
  templateUrl: './uam.component.html',
  styleUrls: ['./uam.component.scss']
})
export class UamComponent implements OnInit {

  public userRoles = [];
  public roleConfig;
  public userForm: FormGroup;
  public genderList = appGenderList;
  public locationList = appLocationList;
  public isUser = false;
  public sapId;
  public userStatusOption = appUserStatus;
  public passwordMatch = true;
  public maxDate: Date;
  public lobConfig;
  public lobList = [];
  public subLobConfig;
  public subLobList = [];
  public isAdmin = false;
  public isManager = false;

  constructor(
    private cdr: ChangeDetectorRef,
    private adminService: AdminService,
    private snackBar: MatSnackBar,
    private fb: FormBuilder,
    private loader: AppLoaderService,
    private router: Router
  ) {
    this.maxDate = new Date();
    this.lobConfig = {
      displayKey:"lobName",
      search:true,
      height: '200px',
      placeholder:'Select LOB',
      customComparator: ()=>{},
      limitTo: this.lobList.length,
      moreText: 'more',
      noResultsFound: 'No results found!',
      searchPlaceholder:'Search',
      searchOnKey: 'lobName'
    }
    this.subLobConfig = {
      displayKey:"subLobName",
      search:true,
      height: '200px',
      placeholder:'Select Sub LOB',
      customComparator: ()=>{},
      limitTo: this.subLobList.length,
      moreText: 'more',
      noResultsFound: 'No results found!',
      searchPlaceholder:'Search',
      searchOnKey: 'subLobName'
    }
    this.roleConfig = {
      displayKey:"role",
      search:true,
      height: '200px',
      placeholder:'Select Role',
      customComparator: ()=>{},
      limitTo: this.userRoles.length,
      moreText: 'more',
      noResultsFound: 'No results found!',
      searchPlaceholder:'Search',
      searchOnKey: 'role'
    }
   }

  ngOnInit() {
    this.loader.open();
    this.createUserForm({});
    this.getAllLob();
    this.getRoles();
    this.loader.close();
  }

  getAllLob(){
    this.loader.open();
    this.adminService.getAllLob()
    .subscribe(res => {
      this.loader.close();
      if(res == 'ERROR'){
        this.snackBar.open(appGenericErr, 'OK', {duration: snackBarDuration});
        return
      }else if (res == null){
        this.snackBar.open('LOB not found.', 'OK', {duration: snackBarDuration});
      }else{
        if(res.length> 0){
          let tempArray = []; 
          res.forEach(lob => {
            if(lob.lobName != 'GENERIC'){
              tempArray.push(lob);
            }
          })
          this.lobList = tempArray;
        }
        this.lobConfig.limitTo = this.lobList.length;
      }
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
    })
  }

  getSubLob(lob){
    this.loader.open();
    this.userForm.get('subLob').setValue([]);
    this.subLobList = [];
    if(lob){
      this.adminService.getSubLob(this.userForm.get('lob').value.lobName)
      .subscribe(res => {
        this.loader.close();
        if(res == 'ERROR'){
          this.snackBar.open(appGenericErr, 'OK', {duration: snackBarDuration});
          return
        }else if (res == null){
          this.snackBar.open('LOB not found.', 'OK', {duration: snackBarDuration});
        }else{
          this.subLobList = res;
          this.subLobConfig.limitTo = this.subLobList.length;
        }
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
      })
    }else{
      this.loader.close();
    }
          
  }

  getRoles(){
    this.loader.open();
    this.adminService.getRole()
    .subscribe(res => {
      this.loader.close();
      if(res == 'ERROR'){
        this.snackBar.open(appGenericErr, 'OK', {duration: snackBarDuration});
      }else{
        this.userRoles = res;
        this.roleConfig.limitTo = this.userRoles.length;
      }
    }, err => {
      this.loader.close();
      if(err.status == '401'){
        this.snackBar.open(appSessionErr, 'OK', {duration: snackBarDuration});
        resetLocalStorage();  
        this.router.navigate([appVariables.loginPageUrl]);
      }else{
        this.snackBar.open(appGenericErr, 'OK', {duration: snackBarDuration});
      } 
    })
  }

  getUserById(){
    if(this.userForm.get('empSapNo').status === 'INVALID'){
      return;
    }
    this.loader.open();
    this.sapId = this.userForm.get('empSapNo').value;
    if(this.userForm.get('empSapNo').value != ''){
      this.adminService.getUserById(this.userForm.get('empSapNo').value)
      .subscribe(res => {
        this.loader.close();
        if(res == 'ERROR'){
          this.snackBar.open(appGenericErr, 'OK', {duration: snackBarDuration});
          this.isUser = false;
          return;
        }
         else {
          this.isUser = true;
          this.createUserForm(res);
        }
      }, err => {
        this.loader.close();
        if(err.status == 401){
          this.snackBar.open(appSessionErr, 'OK', {duration: snackBarDuration});
          resetLocalStorage();
          this.router.navigate([appVariables.loginPageUrl]);
        }
        else if(err.status == 404){
          this.snackBar.open('User Id does not exist, Create a new user', 'OK', {duration: snackBarDuration});
          this.isUser = false;
          this.createUserForm({});
          this.resetUserForm();
        } else{
          this.snackBar.open(appGenericErr, 'OK', {duration: snackBarDuration});
        } 
      })
    }else{
      this.loader.close();
      this.isUser = false;
      this.createUserForm({});
    }
  }

  checkPassword(){
    let password = this.userForm.get('password').value;
    let confirmPassword = this.userForm.get('confirmPassword').value;
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

  createUserForm(userData: any){
    let role = '';
    this.isAdmin = false;
    let dateStr;
    if(this.isUser == true){
      role = userData.roles[0].role;
      if(role == 'ADMIN'){
        this.isAdmin = true;
        this.isManager = false; 
      } else if(role == 'MANAGER'){
        this.isManager = true;
        this.isAdmin = false;
      }
      dateStr = userData.joiningDateSSBJV.replace(/-/g,' ');
    }
    this.userForm = this.fb.group({
      empSapNo: [this.sapId || '', [Validators.required, Validators.maxLength(8), Validators.minLength(8), Validators.pattern(digitPattern)]],
      psid: [userData.psid || '', [Validators.pattern(digitPattern)]],
      password: ['',[Validators.minLength(8),Validators.maxLength(16)]],
      confirmPassword: ['',[Validators.minLength(8),Validators.maxLength(16)]],
      employeeName: [{value: userData.employeeName || '', disabled: this.isUser}, [Validators.required,Validators.pattern(stringPattern)]],
      joiningDateSSBJV: [new Date(dateStr) || '', Validators.required],
      //subBand: [userData.subBand || '',Validators.pattern(subBandPattern)],
      designationName: [userData.designationName || '',Validators.pattern(stringPattern)],
      //processName: [userData.processName || '', Validators.required],
      //payroll: [userData.payroll || '',Validators.pattern(stringPattern)],
      locationName: [userData.locationName ? userData.locationName.toUpperCase() : '', Validators.required],
      //dept: [userData.dept || '',Validators.pattern(stringPattern)],
      gender: [userData.gender ? userData.gender.toUpperCase() : '',Validators.required],
      gdu: [userData.gdu || '',Validators.pattern(stringPattern)],
      rmName: [userData.rmName || '',Validators.pattern(stringPattern)],
      rmSapNo: [userData.rmSapNo || '', [ Validators.maxLength(8), Validators.minLength(8), Validators.pattern(digitPattern)]],
      rmPsId: [userData.rmPsId || '', Validators.pattern(digitPattern)],
      role: [role != '' ? role : [],[Validators.required]],
      status: [userData.status || 'Active'],
      lob: [role == 'ADMIN'? [] : userData.lob || []],
      subLob: [role == 'AGENT' ? userData.subLob : [] || []],
    })
    this.cdr.detectChanges();
  }

  resetUserForm(){
    this.userForm.get('psid').setValue('');
    this.userForm.get('password').setValue('');
    this.userForm.get('confirmPassword').setValue('');
    this.userForm.get('employeeName').setValue('');
    this.userForm.get('joiningDateSSBJV').setValue('');
    //this.userForm.get('subBand').setValue('');
    this.userForm.get('designationName').setValue('');
    //this.userForm.get('processName').setValue('');
    //this.userForm.get('payroll').setValue('');
    this.userForm.get('locationName').setValue('');
    //this.userForm.get('dept').setValue('');
    this.userForm.get('gender').setValue('');
    this.userForm.get('gdu').setValue('');
    this.userForm.get('rmName').setValue('');
    this.userForm.get('rmSapNo').setValue('');
    this.userForm.get('rmPsId').setValue('');
    this.userForm.get('role').setValue([]);
    this.userForm.get('status').setValue('Active');
    this.userForm.get('lob').setValue([]);
    this.userForm.get('subLob').setValue([])

  }

  toggleForAdmin(role){
    if(role.role == 'ADMIN'){
      this.userForm.get('lob').clearValidators();
      this.userForm.get('subLob').clearValidators();
      this.userForm.get('lob').updateValueAndValidity();
      this.userForm.get('subLob').updateValueAndValidity();
      this.isManager = false;
      this.isAdmin = true;
    }else if(role.role == 'AGENT'){
      this.userForm.get('lob').setValidators(Validators.required);
      this.userForm.get('subLob').setValidators(Validators.required);
      this.userForm.get('lob').updateValueAndValidity();
      this.userForm.get('subLob').updateValueAndValidity();
      this.isAdmin = false;
      this.isManager = false;
    }else if(role.role == 'MANAGER'){
      this.isManager = true;
      this.isAdmin = false;
      this.userForm.get('lob').setValidators(Validators.required);
      this.userForm.get('subLob').clearValidators();
      this.userForm.get('lob').updateValueAndValidity();
      this.userForm.get('subLob').updateValueAndValidity();
    }
  }

  createUserObject(action){
    let data = {
      empSapNo: this.userForm.get('empSapNo').value,
      psid: this.userForm.get('psid').value,
      password: this.userForm.get('password').value,
      employeeName: this.userForm.get('employeeName').value,
      joiningDateSSBJV: new DatePipe('en-US').transform(this.userForm.get('joiningDateSSBJV').value, 'yyyy-MMM-dd'),
      //subBand: this.userForm.get('subBand').value,
      designationName: this.userForm.get('designationName').value,
      //processName: this.userForm.get('processName').value,
      //payroll: this.userForm.get('payroll').value,
      locationName: this.userForm.get('locationName').value,
      //dept: this.userForm.get('dept').value,
      gender: this.userForm.get('gender').value,
      gdu: this.userForm.get('gdu').value,
      rmName: this.userForm.get('rmName').value,
      rmSapNo: this.userForm.get('rmSapNo').value,
      rmPsId: this.userForm.get('rmPsId').value,
      createdOn: new DatePipe('en-US').transform(new Date(), 'yyyy-MMM-dd'),
      roles: [{
        id: '',
        role: this.userForm.get('role').value.role ? this.userForm.get('role').value.role : this.userForm.get('role').value
      }],
      status: this.userForm.get('status').value,
      lob: null,
      subLob: null
    }
    if(data.roles[0].role == 'AGENT'){
      data.lob = this.userForm.get('lob').value
      data.subLob = this.userForm.get('subLob').value
    }else if(data.roles[0].role == 'MANAGER'){
      data.lob = this.userForm.get('lob').value;
      data.subLob = null;
    }

    if(action == 'add'){
      this.AddUser(data);
    }
    else if(action == 'update'){
      this.updateUser(data);
    }

  }

  AddUser(data){
    this.loader.open();
    this.adminService.addUser(data)
    .subscribe(res => {
      this.loader.close();
      if(res == 'ERROR'){
        this.snackBar.open(appGenericErr, 'OK', {duration: snackBarDuration});
        return;
      } else{
        this.sapId = '';
      this.createUserForm({});
      this.snackBar.open('User Added Successfuly.', 'OK', {duration: snackBarDuration});
      }
    },err => {
      this.loader.close();
      if(err.status == '401'){this.snackBar.open(appSessionErr, 'OK', {duration: snackBarDuration});
      resetLocalStorage();
      this.router.navigate([appVariables.loginPageUrl]);
      }else if(err.status == '400'){
      } else{
        this.snackBar.open(appGenericErr, 'OK', {duration: snackBarDuration});
      }
    })
  }

  updateUser(data){
    this.loader.open();
    this.adminService.updateUser(data)
    .subscribe(res => {
      this.loader.close();
      if(res == 'ERROR'){
        this.snackBar.open(appGenericErr, 'OK', {duration: snackBarDuration});
        return;
      } else {
      this.isUser=false;
      this.sapId = '';
      this.createUserForm({});
      this.snackBar.open('User Details Updated Successfuly.', 'OK', {duration: snackBarDuration});
      }
    },err => {
      this.loader.close();
      if(err.status == '401'){
        this.snackBar.open(appSessionErr, 'OK', {duration: snackBarDuration});
        resetLocalStorage();
        this.router.navigate([appVariables.loginPageUrl]);
      }else{
        this.snackBar.open(appGenericErr, 'OK', {duration: snackBarDuration});
      }
    })
  }

}
