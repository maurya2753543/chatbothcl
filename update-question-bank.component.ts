import { Component, OnInit } from '@angular/core';
import { AppLoaderService } from "../../../../../shared/services/app-loader/app-loader.service";
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material';
import { AdminService } from '../../../admin.service';
import { appGenericErr, appSessionErr, resetLocalStorage, appVariables, appQuestionStatus, snackBarDuration } from 'src/app/app.constants';

@Component({
  selector: 'app-update-question-bank',
  templateUrl: './update-question-bank.component.html',
  styleUrls: ['./update-question-bank.component.scss']
})
export class UpdateQuestionBankComponent implements OnInit {

  public questionBankList: any[] = [];
  public showPreviewFlag = false;
  public questionStatus = [];
  public questionBankId = '';
  public status = '';

  public questionBankSelected;
  public config;
  public lob;
  public subLob;
  public lobList = [];
  public subLobList = [];
  public lobConfig;
  public subLobConfig;


  constructor(
    private loader: AppLoaderService,
    private router: Router,
    private snackBar: MatSnackBar,
    private adminService: AdminService
  ) { 
    this.config = {
      displayKey:"questionBankName", //if objects array passed which key to be displayed defaults to description
      search:true,//true/false for the search functionlity defaults to false,
      height: '200px', //height of the list so that if there are more no of items it can show a scroll defaults to auto. With auto height scroll will never appear
      placeholder:'Select', // text to be displayed when no item is selected defaults to Select,
      customComparator: ()=>{}, // a custom function using which user wants to sort the items. default is undefined and Array.sort() will be used in that case,
      limitTo: this.questionBankList.length, // a number thats limits the no of options displayed in the UI similar to angular's limitTo pipe
      moreText: 'more', // text to be displayed whenmore than one items are selected like Option 1 + 5 more
      noResultsFound: 'No results found!', // text to be displayed when no items are found while searching
      searchPlaceholder:'Search', // label thats displayed in search input,
      searchOnKey: 'questionBankName' // key on which search should be performed this will be selective search. if undefined this will be extensive search on all keys
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
    this.questionStatus = appQuestionStatus;
    this.getAllLob();
    //this.getQuestionBank();
  }

  getAllLob(){
    this.loader.open();
    this.adminService.getAllLob()
    .subscribe(res => {
      if(res == 'ERROR'){
        this.loader.close();
        this.snackBar.open(appGenericErr, 'OK', {duration: snackBarDuration});
        return
      }else if (res == null){
        this.loader.close();
        this.snackBar.open('LOB not found.', 'OK', {duration: snackBarDuration});
      }else{
        this.loader.close();
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

  getSubLob(){
    this.loader.open();
    this.subLob = [];
    this.subLobList = [];
    this.questionBankSelected = [];
    this.questionBankList = [];
    this.status = '';
    if(this.lob){
      this.adminService.getSubLob(this.lob.lobName)
      .subscribe(res => {
        if(res == 'ERROR'){
          this.loader.close();
          this.snackBar.open(appGenericErr, 'OK', {duration: snackBarDuration});
          return
        }else if (res == null){
          this.loader.close();
          this.snackBar.open('Sub LOB not found for selected LOB', 'OK', {duration: snackBarDuration});
        }else{
          this.loader.close();
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

  getAllQuestionBank(){
    this.loader.open();
    this.questionBankSelected = [];
    this.questionBankList = [];
    this.status = '';
    if(this.subLob){
      this.adminService.getAllQuestionBank(this.subLob.subLobId)
      .subscribe(res => {
        this.loader.close();
        if(res == 'ERROR'){
          this.snackBar.open(appGenericErr, 'OK', {duration: snackBarDuration});
          return
        }else if (res == null){
          this.snackBar.open('Question Banks not found for selected Sub-LOB', 'OK', {duration: snackBarDuration});
        }else{
          this.questionBankList = res;
          this.config.limitTo = this.questionBankList.length;
        }
      }, err => {
        this.loader.close();
        if(err.status == '401'){
          this.snackBar.open(appSessionErr, 'OK', {duration: snackBarDuration});
          resetLocalStorage();
          this.router.navigate([appVariables.loginPageUrl]);
        }
        else if(err.status == '400'){
          this.snackBar.open('Invalid Question Bank Name or Question Id', 'OK', {duration: snackBarDuration});
        }
          else{
          this.snackBar.open(appGenericErr, 'OK', {duration: snackBarDuration});
        }
      })
    }else{
      this.loader.close();
    }
    
  }

  // selectedQB(id){
  //   this.loader.open();
  //   if(id != null && id != undefined){
  //     this.questionBankList.forEach(bank => {
  //       if(bank.questionBankId == id){
  //         this.status = bank.status;
  //       }
  //     })
  //   }
  //   this.loader.close();
  // }

  selectedQB(questionBank){
    this.loader.open();
    if(questionBank != null && questionBank != undefined){
      this.questionBankId = questionBank.questionBankId;
      this.questionBankList.forEach(bank => {
        if(bank.questionBankId == questionBank.questionBankId){
          this.status = bank.status;
        }
      })
    }
    this.loader.close();
  }

  updateQuestionBank(){
    let data = {
      questionBankId: '',
      questionBankName: '',
      status: '',
      questionList: [],
      subLob: this.subLob
    };
    if(this.status != ''){
      if(this.questionBankList.length > 0){
        this.questionBankList.forEach(bank => {
          if(bank.questionBankId == this.questionBankId){
            data.questionBankId = bank.questionBankId;
            data.questionBankName = bank.questionBankName
            data.status = this.status;
            data.questionList = bank.questionBankList;
          }
        })
        this.saveData(data);
      }
    }
  }

  saveData(data){
    this.loader.open();
    this.adminService.updateQuestionBank(data)
    .subscribe(res => {
      this.loader.close();
      if(res == 'ERROR'){
        this.snackBar.open(appGenericErr, 'OK', {duration: snackBarDuration});
        return
      }else{
        this.snackBar.open('Question Bank Updated Successfuly', 'OK', {duration: snackBarDuration});
        this.resetData();
        //this.getQuestionBank();
      }
    }, err => {
      this.loader.close();
      if(err.status == '401'){
        this.snackBar.open(appSessionErr, 'OK', {duration: snackBarDuration});
        resetLocalStorage();
        this.router.navigate([appVariables.loginPageUrl]);
      }
      else if(err.status == '400'){
        this.snackBar.open('Invalid Question Bank Name or Question Id', 'OK', {duration: snackBarDuration});
      }
        else{
        this.snackBar.open(appGenericErr, 'OK', {duration: snackBarDuration});
      }
    })
  }
  resetData(){
    this.questionBankId = '';
        this.status = '';
        this.lob = [];
        this.subLob = [];
        this.lobList = [];
        this.subLob = [];
        this.getAllLob();
        this.questionBankSelected = [];
  }


}
