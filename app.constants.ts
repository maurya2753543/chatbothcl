import { environment } from '../environments/environment';

function createUrl(actionName: string): string {
    return `${environment.apiURL}${actionName}`;
}

export const appVariables = {
    baseUrl:environment.apiURL,
  userLocalStorage: 'user',
  resourceAccessLocalStorage: 'resourceAccessRaw',
  accessTokenServer: 'X-Auth-Token',
  defaultContentTypeHeader: 'application/json',
  loginPageUrl: '',
  registrationPageUrl: '/register',
  errorInputClass: 'has-error',
  successInputClass: 'has-success',
  accessTokenLocalStorage: 'AuthToken'
}

export const appApiPaths = {
    baseUrl: environment.apiURL,
    uploadsPath: `${environment.apiURL}/`,
    login: createUrl('oauth/token'),
    logout: createUrl('api-docs/revokeToken?token='),
    uploadBulkUser: createUrl('api/admin/uploadUserDetails'),
    uploadBulkQuestion: createUrl('api/admin/uploadQuestionBank'),
    getQuestionBank: createUrl('api/admin/getQuestionBank?subLobId='),
    getUserDetails: createUrl('api/admin/getUserDetails'),
    addAssessmentDetails: createUrl('api/admin/submitAssessmentDetails'),
    addAutoAssessmentDetails: createUrl('api/admin/submitAutomaticAssessmentDetails'),
    getUserById: createUrl('api/admin/getUserById?userId='),
    getRole: createUrl('api/admin/getRole'),
    updateUser: createUrl('api/admin/updateUserDetails'), // put request
    addUser: createUrl('api/admin/saveUserDetails'),
    addQuestion: createUrl('api/admin/addQuestion'),
    getAssessmentById: createUrl('api/user/getAssessment?userId='),
    getQuestionSet: createUrl('api/user/getQuestionSet'),
    saveQuizDetais: createUrl('api/user/saveQuizDetails'),
    getRawDataReport: createUrl('api/admin/getRawDataReport?startDate='),
    getUserAssessmentReport: createUrl('api/admin/getUserAssessmentReport?assessmentId='),
    getQuestionReport: createUrl('api/admin/getQuestionReport?questionBankName='),
    getUserReport: createUrl('api/admin/getUserReport?lobId='),
    getDescriptiveAssessment: createUrl('api/admin/getDiscriptiveAssessment?userId='),
    getDescriptiveQuestion: createUrl('api/admin/getDiscriptiveQuesList?assessmentId='),
    saveDescriptiveQuestion: createUrl('api/admin/saveDiscriptiveQuesResult'),
    getQuestionById: createUrl('api/admin/getQuestionById?questionBankName='),
    updateQuestion: createUrl('api/admin/updateQuestion'),
    getAssessmentNameForUserReport: createUrl('api/admin/getAssessmentName?startDate='),
    resetAgentPassword: createUrl('api/user/resetUserPassword'),
    getAllQuestionBank: createUrl('api/admin/getAllQuestionBank?subLobId='),
    updateQuestionBank: createUrl('api/admin/updateQuestionBank'),
    getSummaryReport: createUrl('api/admin/getCountSummaryReport?startDate='),

    // PHASE 2 CHANGES
    saveLob: createUrl('api/admin/saveLob'),
    saveSubLob: createUrl('api/admin/saveSubLob'),
    getAllLob: createUrl('api/admin/getAllLob'),
    getSubLob: createUrl('api/admin/getSubLob?lobName='),
    //AI Reports
    getCategoryWiseAIReport: createUrl('api/admin/getCategoryWiseAlReport?startDate='),
    getLowScoreWiseAIReport: createUrl('api/admin/getLowScoreWiseAlReport?lobId='),
    getHighScoreWiseAIReport: createUrl('api/admin/getHighScoreWiseAlReport?lobId='),
    getQuestionWiseAIReport: createUrl('api/admin/getQuestionWiseAlReport?startDate='),
    getEmployeeWiseSummaryAlReport: createUrl('api/admin/getEmployeeWiseSummaryAlReport?lobId='),
    getEmployeeWiseAlReport: createUrl('api/admin/getEmployeeWiseAlReport?lobId='),
    //sprint 2
    forgotPasswordAuthenticationCheck: createUrl('api-docs/forgotPasswordAuthenticationCheck?userId='),
    resetForgotPassword: createUrl('api-docs/resetForgotPassword'),
    saveCategory: createUrl('api/admin/saveCategory'),
    getAllCategory: createUrl('api/admin/getAllCategory'),
    //sprint 2.2
    getQuestions: createUrl('api/admin/getQuestions?questionBankName='),
    getAssessmentForEdit: createUrl('api/admin/getAssessmentForEdit?startDate='),
    editAssessmentDetails: createUrl('api/admin/editAssessmentDetails'),
    getFailedUserList: createUrl('api/admin/getFailUserList?assessmentId='),
    //phase 3 - Infographic Reports
    
    //phase 4 - Training Tracker Module
    createTrainingPlan: createUrl('api/admin/createTrainingPlan'),
    getTrainingPlan: createUrl('api/admin/getTrainingPlan?subLobId='),
    deactivateTrainingPlan: createUrl('api/admin/deactivateTrainingPlan'),
    createTrainingBatch: createUrl('api/admin/createTrainingBatch'),
    getTrainingBatch: createUrl('api/admin/getTrainingBatch?startDate='),
    editTrainingBatch: createUrl('api/admin/editTrainingBatch'),
    getUserByRole: createUrl('api/admin/getUserByRole?role='),
    getTrainingBatchForAttendanceCoverage: createUrl('api/admin/getTrainingBatchForAttendanceCoverage?startDate='),
    saveTrainingBatchAttendance: createUrl('api/admin/saveTrainingBatchAttendance'),
    getTraineesAttendance: createUrl('api/admin/getTraineesAttendance?trainingDate='),
    saveTrainingBatchSchedule: createUrl('api/admin/saveTrainingBatchSchedule'),
    getTrainingBatchSchedule: createUrl('api/admin/getTrainingBatchSchedule?trainingPlanId='),
    getTrainingBatchBySubLob: createUrl('api/admin/getTrainingBatchBySubLob?subLobId='),
    getBatchSpecificReport: createUrl('api/admin/getTrainingBatchReport?trainingBatchId=')
}

export const localStorageVariables = {
    AuthInfo : 'AuthInfo'
}

export const appLocationList = ['PUNE', 'CHENNAI', 'COIMBATORE', 'VIJAYAWADA'];
// export const appCategoryList = ['Technical', 'Behaviour', 'Domain', 'Process'];
export const appGenderList = ['MALE','FEMALE','OTHER'];
export const digitPattern = '^(0|[1-9][0-9]*)$'; // regex for checking numerical input
export const stringPattern = '^([a-zA-Z .]*)$'; 
export const subBandPattern = '^[E]([0-9].[0-9]]*)$'; 
export const authUserName = 'statestreet-client';
export const authPassword = 'statestreet-secret';
export const appGenericErr = 'Error Occured! Please try again later.';
export const appSessionErr = 'Session Expired, Please Sign In again.';
export const appUserStatus = ['Active','Deactive'];
export const appQuestionStatus = ['Active','Deactive'];
export const snackBarDuration = 7 * 1000; // 7 Seconds
export const appAssessmentFrequency = ['Weekly', 'Bi-Weekly', 'Monthly'];

export const appTrainingBatchStatus = [
    {code: 'Not_Started_Yet',
    value: 'Not Started Yet'},
    {code: 'Active_In_Progress',
    value: 'Active In Progress'},
    {code: 'Completed',
    value: 'Completed'},
    {code: 'Active_Over_Due',
    value: 'Active Over Due'},
    {code: 'Deactivate',
    value: 'Deactivate'}
];
export const appTrainingScheduleStatus = [
    {code: 'Yet_To_Start', value: 'Yet To Start'},
    {code: 'In_Progress', value: 'In Progress'},
    {code: 'Completed', value: 'Completed'},
    {code: 'Overdue', value: 'Overdue'}
];
export const appWeeks =[{name:'Week 1', code:'week1'},
                        {name:'Week 2', code:'week2'},
                        {name:'Week 3', code:'week3'},
                        {name:'Week 4', code:'week4'},
                        {name:'Week 5', code:'week5'},
                        {name:'Week 6', code:'week6'},
                        {name:'Week 7', code:'week7'},
                        {name:'Week 8', code:'week8'}];
export function resetLocalStorage(){
    localStorage.clear();
}