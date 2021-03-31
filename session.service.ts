import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { BaseService } from '../../shared/services/base.service';
import { appApiPaths,authUserName,authPassword, localStorageVariables } from '../../app.constants';
import { HttpHeaders } from '@angular/common/http';
import { SharedService } from '../../shared/shared.service';

@Injectable({
  providedIn: 'root'
})
export class SessionService {
  public userInfo;

  constructor(
    private baseService: BaseService,
    private sharedService: SharedService
  ) { }

  login(postBody: any): Observable<any> {
    let options = this.sharedService.getBasicToken();
    return this.baseService.post(appApiPaths.login, postBody, options)
            .map((res) => {
              if(res.status == 200){
                return res.body;
              } else if(res.status == 204){
                return null;
              }
              else{
                return 'ERROR';
              }
            })
            .catch((error: Response) => Observable.throw(error))
            .finally(() => {
            });
  }
  resetPassword(postBody: any): Observable<any> {
    let options = this.sharedService.getBearerToken();
    return this.baseService.post(appApiPaths.resetAgentPassword, postBody, options)
            .map((res) => {
              if(res.status == 200){
                return res.body;
              } else if(res.status == 204){
                return null;
              }
              else{
                return 'ERROR';
              }
            })
            .catch((error: Response) => Observable.throw(error))
            .finally(() => {
            });
  }

  forgotPasswordAuthenticationCheck(userId, doj): Observable<any> {
    //let options = this.sharedService.getBearerToken();
    let url = appApiPaths.forgotPasswordAuthenticationCheck + userId + '&joiningDate=' + doj;
    return this.baseService.get(url)
            .map((res: any) => {
              return res;
            })
            .catch((error: Response) => Observable.throw(error))
            .finally(() => {
            });
  }

  resetForgotPassword(postBody: any): Observable<any> {
    //let options = this.sharedService.getBearerToken();
    return this.baseService.post(appApiPaths.resetForgotPassword, postBody)
            .map((res) => {
              if(res.status == 200){
                return res.body;
              } else if(res.status == 204){
                return null;
              }
              else{
                return 'ERROR';
              }
            })
            .catch((error: Response) => Observable.throw(error))
            .finally(() => {
            });
  }

  logout(): Observable<any> {
    let user = JSON.parse(localStorage.getItem(localStorageVariables.AuthInfo))
    let options = this.sharedService.getBearerToken();
    return this.baseService.get(appApiPaths.logout + user.access_token, options)
            .map((res: any) => {
              if(res.status == 200){
                return res.body;
              } else if(res.status == 204){
                return null;
              }
              else{
                return 'ERROR';
              }
            })
            .catch((error: Response) => Observable.throw(error))
            .finally(() => {
            });
  }

}
