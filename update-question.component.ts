import { Component, OnInit, Inject, ChangeDetectorRef } from '@angular/core';
import { AppLoaderService } from '../../../../../shared/services/app-loader/app-loader.service';
import { AdminService } from '../../../admin.service';
import { MatSnackBar, MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material';
import { appSessionErr, resetLocalStorage, appVariables, appGenericErr, appQuestionStatus, digitPattern, snackBarDuration } from 'src/app/app.constants';
import { Router } from '@angular/router';
import { FormGroup, FormBuilder, FormControl, FormArray, Validators } from '@angular/forms';
import { DialogData } from '../../../../quiz/question-set/question-set.component';

@Component({
  selector: 'app-update-question',
  templateUrl: './update-question.component.html',
  styleUrls: ['./update-question.component.scss']
})
export class UpdateQuestionComponent implements OnInit {

  public showPreviewFlag = false;
  public questionBankList:any[] = [];
  public questionBankName = '';
  public questionId = '';
  public questionIdErr = '';
  public questionType = '';

  public questionBankSelected;
  public config;
  public lobList = [];
  public lobConfig;
  public subLobList = [];
  public subLobConfig;
  public lob;
  public subLob;
  

  public questionList = [];
  public currentPage = 1;
  public itemsPerPage = 6;

  constructor(
    private loader: AppLoaderService,
    private snackBar: MatSnackBar,
    private adminService: AdminService,
    private router: Router,
    private fb: FormBuilder,
    public dialog: MatDialog,
    private cdRef : ChangeDetectorRef
  ) { 
    this.config = {
      displayKey:"questionBankName",
      search:true,
      height: '200px',
      placeholder:'Select',
      customComparator: ()=>{},
      limitTo: this.questionBankList.length,
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
    //this.getAllCategory();
    this.getAllLob();
    // this.questionStatus = appQuestionStatus;
  }

  // ngAfterViewChecked() {
  //   this.cdRef.detectChanges();
  // }

  
  getAllLob(){
    this.loader.open();
    this.adminService.getAllLob()
    .subscribe(res => {
      this.loader.close();
      if(res == 'ERROR'){
        
        this.snackBar.open(appGenericErr, 'OK', {duration: snackBarDuration});
        return
      }else if (res == null){
        //this.loader.close();
        this.snackBar.open('LOB not found.', 'OK', {duration: snackBarDuration});
      }else{
        //this.loader.close();
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
    this.showPreviewFlag = false;
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

  resetData(){
    this.showPreviewFlag = false;
    this.questionType = '';
    // this.image = '';
    // this.initialMaqCorrectAnswerList = [];
    // this.saveQuestion = null;
    //this.createForm({});
    this.questionList = [];
  }

  validateQuestionId(){
    if(this.questionId == ''){
      this.questionIdErr = 'Question Id is required.';
    } else if(!this.questionId.toString().match(digitPattern)){
      this.questionIdErr = 'Question Id must be digit';
    }
    else{
      this.questionIdErr = '';
    }
  }  

  getQuestionBank(){
    this.loader.open();
    this.questionBankSelected = [];
    this.questionBankList = [];
    this.showPreviewFlag = false;
    if(this.subLob){
      this.adminService.getQuestionBank(this.subLob.subLobId)
      .subscribe(res => {
        if(res == 'ERROR'){
          this.loader.close();
          this.snackBar.open(appGenericErr, 'OK', {duration: snackBarDuration});
          return
        }else if (res == null){
          this.loader.close();
          this.snackBar.open('Question Banks not found for selected Sub-LOB', 'OK', {duration: snackBarDuration});
        }else{
          this.loader.close();
          this.questionBankList = res;
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

  getQuestions(questionBankName, subLobId){
    this.loader.open();

    this.adminService.getQuestions(questionBankName, subLobId)
    .subscribe(res => {
      this.loader.close();
      if(res == 'Error'){
        this.snackBar.open(appGenericErr, 'OK', {duration: snackBarDuration});
        return;
      } else if(res == null){
        this.snackBar.open('Question does not exist.', 'OK', {duration: snackBarDuration});
      } else{
        this.questionList = res;
        //this.createForm(res.questionList[0]);
        //this.saveQuestion = {...res};
        this.showPreviewFlag = true;
      }
    }, err => {
      this.loader.close();
      this.showPreviewFlag = false;
      if(err.status == '401'){
        this.snackBar.open(appSessionErr, 'OK', {duration: snackBarDuration});
        resetLocalStorage();
        this.router.navigate([appVariables.loginPageUrl]);
      } else if(err.status == '400'){
        this.snackBar.open('Invalid Request.', 'OK', {duration: snackBarDuration});
      } else{
        this.snackBar.open(appGenericErr, 'OK', {duration: snackBarDuration});
      }
    })
  }

  getQuestionById(questionBankName, subLobId, questionId){
    this.loader.open();

    this.adminService.getQuestionById(questionBankName, subLobId, questionId)
    .subscribe(res => {
      this.loader.close();
      if(res == 'Error'){
        this.snackBar.open(appGenericErr, 'OK', {duration: snackBarDuration});
        return;
      } else if(res == null){
        this.snackBar.open('Question does not exist.', 'OK', {duration: snackBarDuration});
      } else{
        // this.questionData = res.questionList[0];
        // this.questionType = this.questionData.type;
        // this.createForm(res.questionList[0]);
        // this.saveQuestion = {...res};
     //this.showPreviewFlag = true;
     this.openDialog(res);
      }
    }, err => {
      this.loader.close();
      //this.showPreviewFlag = false;
      if(err.status == '401'){
        this.snackBar.open(appSessionErr, 'OK', {duration: snackBarDuration});
        resetLocalStorage();
        this.router.navigate([appVariables.loginPageUrl]);
      } else if(err.status == '400'){
        this.snackBar.open('Invalid Request.', 'OK', {duration: snackBarDuration});
      } else{
        this.snackBar.open(appGenericErr, 'OK', {duration: snackBarDuration});
      }
    })
  }

  openDialog(data): void {
    const dialogRef = this.dialog.open(QuestionEditDialogComponent, {
      width: '1000px',
      height: '700px',
      data: data
    });

    dialogRef.afterClosed().subscribe(result => {
      this.getQuestions(this.questionBankSelected.questionBankName,this.subLob.subLobId);
    });  
  }


}

@Component({
  selector: 'app-question-edit-dialog',
  templateUrl: './question-edit-dialog.html',
  styleUrls: ['./update-question.component.scss']
})
export class QuestionEditDialogComponent implements OnInit {
  public questionData;
  public questionType;
  public mcqForm: FormGroup;
  public maqForm: FormGroup;
  public imageForm: FormGroup;
  public descriptiveForm: FormGroup;
  public matchForm: FormGroup;
  public questionStatus = [];
  public image = '';
  public initialMaqCorrectAnswerList = [];
  public questionCategoryList = [];
  public categoryConfig;
  public imageChange = false;
  public saveQuestion;
  public duplicateErr = '';
  public receivedData;


  constructor(
    public dialogRef: MatDialogRef<QuestionEditDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData,
    private loader: AppLoaderService,
    private snackBar: MatSnackBar,
    private adminService: AdminService,
    private router: Router,
    private fb: FormBuilder,
    private cdRef : ChangeDetectorRef
  ) {
    this.receivedData = data;
    this.questionData = this.receivedData.questionList[0];
    this.questionType = this.questionData.type;
    this.saveQuestion = {...this.receivedData};
    this.categoryConfig = {
      displayKey:"categoryName",
      search:true,
      height: '200px',
      placeholder:'Select',
      customComparator: ()=>{},
      limitTo: this.questionCategoryList.length,
      moreText: 'more',
      noResultsFound: 'No results found!',
      searchPlaceholder:'Search',
      searchOnKey: 'categoryName'
    }
   }

  ngOnInit() {
    this.getAllCategory();
    this.questionStatus = appQuestionStatus;
    //this.getQuestionById(this.receivedData.questionBankName, this.receivedData.subLobId, this.receivedData.questionId);
    this.createForm(this.questionData);
  }

  ngAfterViewChecked() {
    this.cdRef.detectChanges();
  }

  getAllCategory(){
    this.loader.open();
    this.adminService.getAllCategory()
    .subscribe(res => {
      this.loader.close();
      if(res == 'ERROR'){
        this.snackBar.open(appGenericErr, 'OK', {duration: snackBarDuration});
        return
      }else if (res == null){
        this.snackBar.open('LOB not found.', 'OK', {duration: snackBarDuration});
      }else{
        this.questionCategoryList = res;
        this.categoryConfig.limitTo = this.questionCategoryList.length;
      }
    }, err => {
      this.loader.close();
      if(err.status == '401'){
        this.snackBar.open(appSessionErr, 'OK', {duration: snackBarDuration});
        resetLocalStorage();
        this.router.navigate([appVariables.loginPageUrl]);
      }else if(err.status == '404'){
        this.snackBar.open('No Category Found.', 'OK', {duration: snackBarDuration});
      }
      else{
        this.snackBar.open(appGenericErr, 'OK', {duration: snackBarDuration});
      }
    })
  }


  createForm(question){
    if(question.type){
      this.questionType = question.type;
    }
    
    if(this.questionType == 'Mcq'){
      this.createMcqForm(question);
    }
    else if(this.questionType == 'Maq'){
      this.createMaqForm(question);
    }
    else if(this.questionType == 'Match'){
      this.createMatchForm(question);
    }
    else if(this.questionType == 'Image'){
      this.createImageForm(question);
    }
    else if(this.questionType == 'Descriptive'){
      this.createDescriptiveForm(question);
    }
  }

  addOptionsFormGroup(option?:any): FormGroup {  
    let control = this.fb.group({
      _id: [option.optionId || option._id || ''],
      optionName: [option.optionName || '', Validators.required],
      answer: [option.answer|| ''],
      feedback: [option.feedback || '']
    });

    if(this.questionType == 'Match'){
      control.get('optionName').clearValidators();
      control.get('answer').setValidators(Validators.required);
      control.get('optionName').updateValueAndValidity();
      control.get('answer').updateValueAndValidity();
    }
    return control;
  }

  createMcqForm(question?:any){
    this.mcqForm = this.fb.group({
      questionText: new FormControl(question.questionText || '', Validators.required),
      correctAnswer: new FormControl(question.correctAnswer.length > 0 ? question.correctAnswer[0].optionName: '', Validators.required),
      correctAnswerArr: this.fb.array(question.correctAnswer || []),
      optionList: this.fb.array([]),
      status: new FormControl(question.status || '', Validators.required),
      category: new FormControl(question.category != '' ? question.category : [] , Validators.required)
    })

    if(question.optionList){
      question.optionList.forEach( opt => {
        (<FormArray>this.mcqForm.get('optionList')).push(this.addOptionsFormGroup(opt));
      })
    }
  }

  createMaqForm(question?: any){
    this.maqForm = this.fb.group({
      questionText: new FormControl(question.questionText || '', Validators.required),
      category: new FormControl(question.category != '' ? question.category : [], Validators.required),
      optionList: this.fb.array([]),
      status: new FormControl(question.status || '', Validators.required)
    })
    if(question.optionList){
      question.optionList.forEach( opt => {
        (<FormArray>this.maqForm.get('optionList')).push(this.addOptionsFormGroup(opt));
      })
    }
    if(question.correctAnswer){
      question.correctAnswer.forEach( opt => {
        let obj = {
          _id: opt.optionId,
          optionName: opt.optionName,
          answer: opt.answer,
          feedback: opt.feedback
        }
        this.initialMaqCorrectAnswerList.push(obj);
      })
    }
  }

  addMatchOption(){
    (<FormArray>this.matchForm.get('optionList')).push(this.addOptionsFormGroup({}));
  }

  createMatchForm(question?:any){
    this.matchForm = this.fb.group({
      questionText: new FormControl(question.questionText || '', Validators.required),
      optionList: this.fb.array([]),
      status: new FormControl(question.status || '', Validators.required),
      category: new FormControl(question.category != '' ? question.category : [], Validators.required)
    })
    if(question.optionList){
      question.optionList.forEach( opt => {
        (<FormArray>this.matchForm.get('optionList')).push(this.addOptionsFormGroup(opt));
      })
    }
  }

  createImageForm(question?: any){
    this.imageForm = this.fb.group({
      questionText: new FormControl(question.questionText || '', Validators.required),
      optionList: this.fb.array([]),
      correctAnswer: new FormControl(question.correctAnswer[0].optionName, Validators.required),
      correctAnswerArr: this.fb.array(question.correctAnswer || []),
      status: new FormControl(question.status || '', Validators.required),
      image: new FormControl( question.imageByte.data || '', Validators.required),
      category: new FormControl(question.category != '' ? question.category : [], Validators.required)
    })
    if(question.optionList){
      question.optionList.forEach( opt => {
        (<FormArray>this.imageForm.get('optionList')).push(this.addOptionsFormGroup(opt));
      })
    }
    this.image = question.imageByte.data;
  }

  imageFileSelect(event){
    this.imageChange = true;
    if (event.target.files.length > 0) {
      const file = event.target.files[0];
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => {
      this.imageForm.get('image').setValue(reader.result);

      var imageStr = this.imageForm.get('image').value;
      var base64result = imageStr.split(',')[1];
      this.image = base64result;
    };
  }else{
      this.imageForm.get('image').setValue('');
    }
}

  createDescriptiveForm(question?:any){
    this.descriptiveForm = this.fb.group({
      questionText: new FormControl(question.questionText || '', Validators.required),
      status: new FormControl(question.status || '', Validators.required),
      category: new FormControl(question.category != '' ? question.category : [], Validators.required)
    })
  }

  radioChange(id, name){
    let obj = {
      _id: id,
      optionName: name,
      answer: '',
      feedback: ''
    }
    if(this.questionType == 'Mcq'){
      this.mcqForm.get('correctAnswer').setValue(name);
      if(this.mcqForm.controls['correctAnswerArr'].value.length > 0){
        (<FormArray>this.mcqForm.get('correctAnswerArr')).clear();
        (<FormArray>this.mcqForm.get('correctAnswerArr')).push(this.addOptionsFormGroup(obj));
      }else{
        (<FormArray>this.mcqForm.get('correctAnswerArr')).push(this.addOptionsFormGroup(obj));
      }
    }
    else if(this.questionType == 'Image'){
      this.imageForm.get('correctAnswer').setValue(name);
      if(this.imageForm.controls['correctAnswerArr'].value.length > 0){
        (<FormArray>this.imageForm.get('correctAnswerArr')).clear();
        (<FormArray>this.imageForm.get('correctAnswerArr')).push(this.addOptionsFormGroup(obj));
      }else{
        (<FormArray>this.imageForm.get('correctAnswerArr')).push(this.addOptionsFormGroup(obj));
      }
    }

  }

  checkboxChange(id, name, event){
    let count = 0;
    let obj = {
      _id: id,
      optionName: name,
      answer: '',
      feedback: ''
    };
    if(event.checked == true){
      if(this.initialMaqCorrectAnswerList.length > 0){
        for (let i = 0 ; i < this.initialMaqCorrectAnswerList.length ; i++) {
          let control = this.initialMaqCorrectAnswerList[i];
          if(control._id == id ){
            this.initialMaqCorrectAnswerList[i].optionName = name;
            count++;
          }else{
            continue;
          }
        }
        if(count == 0){
          this.initialMaqCorrectAnswerList.push(obj);
        }
      }else{
        this.initialMaqCorrectAnswerList.push(obj);
      }
    }else if (event.checked == false){
      this.initialMaqCorrectAnswerList = this.initialMaqCorrectAnswerList.filter(function( obj ) {
        return obj._id !== id;
      });
    }
    else if(event.checked == undefined){
      event.checked = false;
      this.checkboxChange(id, name, event);
    }
    
  }

  checkboxInitial(id,name){
    let flag = false;
    for(let option of this.initialMaqCorrectAnswerList){
      if (option._id == id && option.optionName == name) {
        flag = true;
        break;
      }
    }
    return flag;
  }

  checkDistinctValue(optionList){
    let count = 0;
    let optionArr = [];
    optionList.forEach(option => {
      optionArr.push(option.optionName);
    });
    for(let i = 0; i < optionArr.length; i++){
      for(let j=i+1; j< optionArr.length; j++){
        if(optionArr[i] == optionArr[j]){
          count++;
        }
      }
    }
    if(count > 0){
      this.duplicateErr = 'Options should be Distinct. Please add distinct options and save again.';
      return false;
    }else{
      this.duplicateErr = '';
      return true;
    }
  }

  updateQuestion(form){
    this.loader.open();
    if(this.questionType == 'Maq' || this.questionType == 'Mcq'){
      if(this.checkDistinctValue(form.value.optionList)){
        this.saveQuestion.questionList[0].correctAnswer = this.initialMaqCorrectAnswerList;
      }else{
        this.loader.close();
        return;
      }
      
    }
    this.saveQuestion.questionList[0].questionText = form.value.questionText;
    this.saveQuestion.questionList[0].optionList = form.value.optionList;
    this.saveQuestion.questionList[0].status = form.value.status;
    if(typeof(form.value.category)=== 'string'){
      this.saveQuestion.questionList[0].category = form.value.category.replace(/ /g, '_');
    }else if(form.value.category.categoryName){
      this.saveQuestion.questionList[0].category = form.value.category.categoryName;
    }
    if(this.questionType == 'Maq'){
        this.saveQuestion.questionList[0].correctAnswer = this.initialMaqCorrectAnswerList;
      
      
    } else{
      this.saveQuestion.questionList[0].correctAnswer = form.value.correctAnswerArr;
    }
    if(this.questionType == 'Image'){
      if(this.imageChange == true){
        var imageStr = form.value.image;
        var base64result = imageStr.split(',')[1];
        this.saveQuestion.questionList[0].imageForUI = base64result;
        this.saveQuestion.questionList[0].imageByte = null;
      }else{
        this.saveQuestion.questionList[0].imageForUI = form.value.image;
        this.saveQuestion.questionList[0].imageByte = null;
      }
      
    }
    if(this.questionType == 'Match'){
      this.saveQuestion.questionList[0].correctAnswer = [];
    }
    this.adminService.updateQuestion(this.saveQuestion)
    .subscribe(res => {
      this.loader.close();
      if(res == 'ERROR'){
        this.snackBar.open(appGenericErr, 'OK', {duration: snackBarDuration});
        return;
      }else{
        this.snackBar.open('Question Updated Successfuly.', 'OK', {duration: snackBarDuration});
        this.closeDialog();
      }
    }, err => {
      this.loader.close();
      this.closeDialog();
      if(err.status == '401'){
        this.snackBar.open(appSessionErr, 'OK', {duration: snackBarDuration});
        resetLocalStorage();
        this.router.navigate([appVariables.loginPageUrl]);
      }else{
        this.snackBar.open(appGenericErr, 'OK', {duration: snackBarDuration});
      }
    })
  }

  closeDialog(): void {
    this.dialogRef.close();
  }

}
