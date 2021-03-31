import { Component, OnInit } from '@angular/core';
import { AppLoaderService } from '../../../shared/services/app-loader/app-loader.service';
import { AdminService } from '../admin.service';
import { localStorageVariables, appSessionErr, resetLocalStorage, appVariables, appGenericErr, snackBarDuration } from 'src/app/app.constants';
import { MatSnackBar, MatCheckboxChange } from "@angular/material";
import { Router } from '@angular/router';

@Component({
  selector: 'app-assessment-evaluation',
  templateUrl: './assessment-evaluation.component.html',
  styleUrls: ['./assessment-evaluation.component.scss']
})
export class AssessmentEvaluationComponent implements OnInit {

  public userInfo;
  public assessmentList:any[] = [];
  public assessmentId = '';
  public descriptiveQuestionList: any[] = [];
  public currentPage:any;
  public saveDescriptiveQuestionArray:any[] = [];
  public marksErr = '';

  public lob;
  public lobList = [];
  public lobConfig;
  public selectedAssessment;
  public assessmentConfig;
  public subLob;
  public subLobList = [];
  public subLobConfig;


  constructor(
    private loader: AppLoaderService,
    private adminService: AdminService,
    private snackBar: MatSnackBar,
    private router: Router
  ) { 
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
    this.assessmentConfig = {
      displayKey:"assessmentName",
      search:true,
      height: '200px',
      placeholder:'Select',
      customComparator: ()=>{},
      limitTo: this.assessmentList.length,
      moreText: 'more',
      noResultsFound: 'No results found!',
      searchPlaceholder:'Search',
      searchOnKey: 'assessmentName'
    }
  }

  ngOnInit() {
    this.userInfo = JSON.parse(localStorage.getItem(localStorageVariables.AuthInfo));
    this.getAllLob();
    //this.getDescriptiveAssessment();
  }

  setAssessmentId(assessment){
    this.assessmentId = assessment.assessmentId;
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
      }else if(err.status == '404'){
        this.snackBar.open('No LOB Found.', 'OK', {duration: snackBarDuration});
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
    this.selectedAssessment = [];
    this.descriptiveQuestionList = [];
    if(this.lob){
      this.adminService.getSubLob(this.lob.lobName)
      .subscribe(res => {
        if(res == 'ERROR'){
          this.loader.close();
          this.snackBar.open(appGenericErr, 'OK', {duration: snackBarDuration});
          return
        }else if (res == null){
          this.loader.close();
          this.snackBar.open('Sub LOB not found.', 'OK', {duration: snackBarDuration});
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
        }else if(err.status == '404'){
          this.snackBar.open('No Sub LOB found for selected LOB.', 'OK', {duration: snackBarDuration});
        }
        else{
          this.snackBar.open(appGenericErr, 'OK', {duration: snackBarDuration});
        }
      })
    }else{
      this.loader.close();
    }
    
  }

  getDescriptiveAssessment(subLob){
    this.loader.open();
    if(subLob){
      this.userInfo = JSON.parse(localStorage.getItem(localStorageVariables.AuthInfo));
      
      this.adminService.getDescriptiveAssessment(this.userInfo.userDetail.username, subLob.subLobId)
      .subscribe(res => {
        this.loader.close();
        if(res == 'ERROR'){
          this.snackBar.open(appGenericErr, 'OK', {duration: snackBarDuration});
          return;
        }else if(res == null ){
          this.snackBar.open('No Assessment available for selected Sub LOB', 'OK', {duration: snackBarDuration});
          return;
        }
        else{
          this.assessmentList = res;
        }
      }, err => {
        this.loader.close();
        if(err.status == '401'){this.snackBar.open(appSessionErr, 'OK', {duration: snackBarDuration});
        resetLocalStorage();
        this.router.navigate([appVariables.loginPageUrl]);
        }else{
          this.snackBar.open(appGenericErr, 'OK', {duration: snackBarDuration});
        }
      })
    }else{
      this.loader.close();
    }
    
  }

  getDescriptiveQuestion(assessmentId){
    this.loader.open();
    this.descriptiveQuestionList = [];
    this.saveDescriptiveQuestionArray =[];
    this.adminService.getDescriptiveQuestion(assessmentId)
    .subscribe(res => {
      this.loader.close();
      if(res == 'ERROR'){
        this.snackBar.open(appGenericErr, 'OK', {duration: snackBarDuration});
        return;
      }
      else if(res != null && res != []){
        res.forEach(data => {
          let obj = {...data, evaluationCompleted: false}
          this.saveDescriptiveQuestionArray.push(obj);
          this.descriptiveQuestionList.push(obj);
        })
      }
      
    }, err => {
      this.loader.close();
      if(err.status == '401'){this.snackBar.open(appSessionErr, 'OK', {duration: snackBarDuration});
      resetLocalStorage();
      this.router.navigate([appVariables.loginPageUrl]);
      }else{
        this.snackBar.open(appGenericErr, 'OK', {duration: snackBarDuration});
      }
    })
  }

  updateUserMarks(userId, questionId, quizId, event){
    this.saveDescriptiveQuestionArray.forEach(question => {
      if(question.userId == userId && question.questionId == questionId && question.quizId == quizId){
        if(event.target.value > question.totalMarks){
          this.marksErr = 'Obtained markes cannot be greater then Total Marks';
          return;
        }else{
          this.marksErr = '';
          question.obtainedMarks = event.target.value;
          question.evaluationCompleted = true;
        }
      }
    })
  }

  updateEvaluationStatus(userId, questionId, quizId, event:MatCheckboxChange){
    this.saveDescriptiveQuestionArray.forEach(question => {
      if(question.userId == userId && question.questionId == questionId && question.quizId == quizId){
        if(event.checked == true){
          question.evaluationCompleted = true;
        } else if(event.checked == false){
          question.evaluationCompleted = false;
        }
        
      }
    })
  }

  saveDescriptiveQuestion(){
    this.loader.open();
    let data = [];
    this.saveDescriptiveQuestionArray.forEach( question => {
      if(question.evaluationCompleted == true){
        let obj = {
          discriptiveAnswer: question.discriptiveAnswer,
          obtainedMarks: question.obtainedMarks,
          questionId: question.questionId,
          questionText: question.questionText,
          quizId: question.quizId,
          totalMarks: question.totalMarks,
          userId: question.userId,
          userName: question.userName
        }
        data.push(obj);
      }
    });
    this.adminService.saveDescriptiveQuestion(data)
    .subscribe(res => {
      this.loader.close();
      if(res == 'ERROR'){
        this.snackBar.open(appGenericErr, 'OK', {duration: snackBarDuration});
        return;
      }else{
        this.snackBar.open('Evaluation Saved Successfuly.', 'OK', {duration: snackBarDuration});
        //this.assessmentId = '';
        this.descriptiveQuestionList = [];
        this.resetData();
      }
      
    }, err => {
      this.loader.close();
      if(err.status == '401'){this.snackBar.open(appSessionErr, 'OK', {duration: snackBarDuration});
      resetLocalStorage();
      this.router.navigate([appVariables.loginPageUrl]);
      }else{
        this.snackBar.open(appGenericErr, 'OK', {duration: snackBarDuration});
      }
    })
  }

  resetData(){
    this.marksErr = '';
    //this.descriptiveQuestionList = [];
    this.getDescriptiveQuestion(this.assessmentId);
    //this.saveDescriptiveQuestionArray = [];
    // this.lob = [];
    // this.subLob = [];
    // this.selectedAssessment = [];
    // this.lobList = [...this.lobList];
    // this.subLobList = [...this.subLobList];
    // this.assessmentList = [...this.assessmentList]
  }

}
