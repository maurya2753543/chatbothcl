import { Component, OnInit, Input, ViewChild, ElementRef } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';
import { appSessionErr, appGenericErr, appVariables, resetLocalStorage, snackBarDuration } from '../../app.constants';
import { SharedService } from '../shared.service';
import { MatSnackBar } from "@angular/material";
import { Router } from '@angular/router';
import { AppLoaderService } from '../services/app-loader/app-loader.service';

@Component({
  selector: 'app-bulk-upload',
  templateUrl: './bulk-upload.component.html',
  styleUrls: ['./bulk-upload.component.scss']
})
export class BulkUploadComponent implements OnInit {

  @ViewChild('selectedFile', { static: false }) selectedFile: ElementRef;
  @Input() pathName: string;

  public uploadForm: FormGroup;
  public arrayBuffer:any;
  public file:File;
  public bankNameList = [];
  public questionBankConfig;
  public lobList = [];
  public subLobList = [];
  public lobConfig;
  public subLobConfig;
  public addNewQb = false;

  constructor(
    private formBuilder: FormBuilder,
    private sharedService : SharedService,
    private snackBar : MatSnackBar,
    private router: Router,
    private loader: AppLoaderService
    ) {
      this.questionBankConfig = {
        displayKey:"questionBankName",
        search:true,
        height: '200px',
        placeholder:'Select',
        customComparator: ()=>{},
        limitTo: this.bankNameList.length,
        moreText: 'more',
        noResultsFound: 'No results found!',
        searchPlaceholder:'Search',
        searchOnKey: 'questionBankName'
        }
      this.lobConfig = {
        displayKey:"lobName",
        search:true,
        height: '200px',
        placeholder:'Select',
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
        placeholder:'Select',
        customComparator: ()=>{},
        limitTo: this.subLobList.length,
        moreText: 'more',
        noResultsFound: 'No results found!',
        searchPlaceholder:'Search',
        searchOnKey: 'subLobName'
      }
     }

  ngOnInit() {
    this.loader.open();
    this.createBulkUploadForm();
    this.getAllLob();
    if(this.pathName == 'uploadBulkQuestion'){
      this.toggleValidation();
    }

    this.loader.close();
  }

  createBulkUploadForm(){
    this.uploadForm = this.formBuilder.group({
      file: [''],
      localFilePath: [''],
      lob: new FormControl([]),
      subLob: new FormControl([]),
      selectedQuestionBankName: new FormControl([]),
      newQuestionBankName: new FormControl('')
    });
  }

  getAllLob(){
    this.loader.open();
    this.sharedService.getAllLob()
    .subscribe(res => {
      this.loader.close();
      if(res == 'ERROR'){
        this.snackBar.open(appGenericErr, 'OK', {duration: snackBarDuration});
        return
      }else if (res == null){
        this.snackBar.open('LOB not found.', 'OK', {duration: snackBarDuration});
      }else{
        this.lobList = res;
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
    this.uploadForm.get('subLob').setValue([]);
    this.subLobList = [];
    this.uploadForm.get('selectedQuestionBankName').setValue([]);
    if(lob){
      this.sharedService.getSubLob(lob.lobName)
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

  getQuestionBank(subLob){
    if(this.pathName != "uploadBulkQuestion"){
      return;
    }
    this.loader.open();
    let obj = {
      questionBankId: 0,
      questionBankName: "NEW",
      status: "Active",
      questionList: []
    }
    let newList = [obj];
    this.uploadForm.get('selectedQuestionBankName').setValue([]);
    this.bankNameList = [];
    this.sharedService.getQuestionBank(subLob.subLobId)
    .subscribe(res => {
      this.loader.close();
      if(res == 'ERROR'){
        this.snackBar.open(appGenericErr, 'OK', {duration: snackBarDuration});
        return
      }else if (res == null){
        this.bankNameList = newList;
        this.snackBar.open('Question Banks not found.', 'OK', {duration: snackBarDuration});
      }else{
        newList.push(...res);
        this.bankNameList = newList;
        this.questionBankConfig.limitTo = this.bankNameList.length;
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

  onFileSelect(event) {
    if (event.target.files.length > 0) {
      const file = event.target.files[0];
      this.uploadForm.get('file').setValue(file);
    }else{
      this.uploadForm.get('file').setValue('');
    }
  }
  
  uploadFile() {
    this.loader.open();
    let data = { 
      file: this.uploadForm.get('file').value
    }
    if(this.pathName == 'uploadBulkQuestion'){
      if(this.uploadForm.get('selectedQuestionBankName').value.questionBankName == 'NEW'){
        data['questionBankName'] = this.uploadForm.get('newQuestionBankName').value;
      }else {
        data['questionBankName'] = this.uploadForm.get('selectedQuestionBankName').value.questionBankName;
      }
      data['subLobId'] = this.uploadForm.get('subLob').value.subLobId;
      
    }
    this.sharedService.uploadBulk(this.pathName, data)
    .subscribe(res => {
      this.loader.close();
      if(res.status == 200){
        this.snackBar.open('File is uploaded successfully', 'OK', {duration: snackBarDuration});
        this.resetUploadForm();
        if(this.pathName == 'uploadBulkQuestion'){
         //this.getQuestionBank();
        }
      }else if(res.error){
        this.snackBar.open(res.error, 'OK', {duration: snackBarDuration});
        if(this.selectedFile){
          this.selectedFile.nativeElement.value = null;
        }
        return;
      } 
      
    }, err => {
      this.loader.close();
      if(err.status == '401'){
        this.snackBar.open(appSessionErr, 'OK', {duration: snackBarDuration});
        resetLocalStorage();
        this.router.navigate([appVariables.loginPageUrl]);
      }else if(err.status == '400'){
        if(err.error.error){
          this.snackBar.open(err.error.error, 'OK', {duration: snackBarDuration});
        }else{
          this.snackBar.open('Upload failed. Invalid/Missing data.', 'OK', {duration: snackBarDuration});
        }
        
        if(this.selectedFile){
          this.selectedFile.nativeElement.value = null;
        }
      }
      else{
        this.snackBar.open('Invalid file format.', 'OK', {duration: snackBarDuration});
      }
    })
  }

  // addNewQB(){
  //   this.addNewQb = true;
  //   this.uploadForm.get('selectedQuestionBankName').setValue('');
  //   this.uploadForm.get('newQuestionBankName').setValidators([Validators.required, Validators.maxLength(100)]);
  //   this.uploadForm.get('newQuestionBankName').updateValueAndValidity();
  // }

  toggleValidation(){
    this.uploadForm.get('lob').setValidators([Validators.required]);
    this.uploadForm.get('subLob').setValidators([Validators.required]);
    this.uploadForm.get('selectedQuestionBankName').setValidators([Validators.required]);
    this.uploadForm.get('selectedQuestionBankName').updateValueAndValidity();
    this.uploadForm.get('newQuestionBankName').clearValidators();
    this.uploadForm.get('newQuestionBankName').updateValueAndValidity();
    this.uploadForm.get('lob').updateValueAndValidity();
    this.uploadForm.get('subLob').updateValueAndValidity();
  }

  toggleQuestionBankName(){
    if(this.uploadForm.get('selectedQuestionBankName').value.questionBankName == 'NEW'){
      this.uploadForm.get('newQuestionBankName').setValidators([Validators.required, Validators.maxLength(100)]);
      this.uploadForm.get('newQuestionBankName').updateValueAndValidity();
    }else{
      this.uploadForm.get('newQuestionBankName').clearValidators();
      this.uploadForm.get('newQuestionBankName').updateValueAndValidity();
    }
  }

  resetUploadForm(){
    this.getAllLob();
    this.createBulkUploadForm();
    if(this.selectedFile){
      this.selectedFile.nativeElement.value = null;
    }
  }

}
