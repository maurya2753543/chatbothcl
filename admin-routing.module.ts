import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AdminComponent } from './admin.component';
import { UamComponent } from './uam/uam.component';
import { AddUserOptionComponent } from './add-user-option/add-user-option.component';
import { BulkUploadUamComponent } from './bulk-upload-uam/bulk-upload-uam.component';
import { ManageQuizComponent } from './manage-quiz/manage-quiz.component';
import { ManageAssessmentComponent } from './manage-assessment/manage-assessment.component';
import { QuestionComponent } from "./manage-quiz/detailTabs/add-question/QuestionComponent";
import { AssessmentEvaluationComponent } from './assessment-evaluation/assessment-evaluation.component';
import { TrainingTrackerComponent } from './training-tracker/training-tracker.component';

const routes: Routes = [{ path: '', component: AdminComponent },
{ path: 'addUser', component: AddUserOptionComponent },
{ path: 'bulkUam', component: BulkUploadUamComponent },
{ path: 'uam', component: UamComponent },
{ path: 'manage-quiz', component: ManageQuizComponent },
{ path: 'manage-assessment', component: ManageAssessmentComponent },
{ path: 'add-question', component: QuestionComponent},
{ path: 'evaluation', component: AssessmentEvaluationComponent},
{ path: 'tracker', component: TrainingTrackerComponent}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdminRoutingModule { }
