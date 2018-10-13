import {Injectable} from '@angular/core';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/toPromise';
import {Observable} from "rxjs/Observable";
import "rxjs/add/operator/do";
import {User} from "../models/user";
import "rxjs/add/operator/take";
import {CONFIG} from "../../app-config";
import {XAuthHttpProvider} from "./helpers/x-auth-http.provider";

@Injectable()
export class UserProvider {

  static profileImgBaseUrlUserId: string = CONFIG.rocketchatBaseUrl + '/api/v1/users.getAvatar?userId='; // Add RocketChat userid;
  static profileImgBaseUrlUsername: string = CONFIG.rocketchatBaseUrl + '/avatar/'; // Add RocketChat username;

  constructor(private xAuthHttp: XAuthHttpProvider) {

  }

  findUsers(search: string): Observable<User[]> {
    return this.xAuthHttp.get<{ users: User[] }>(`${CONFIG.backendBaseUrl}/api/profiles/search/${search}`)
      .map(res => res.users);
  }

  getUsers(): Observable<User[]> {
    return this.xAuthHttp.get<{ users: User[] }>(`${CONFIG.backendBaseUrl}/api/profiles`)
      .map(res => res.users);
  }

  getCurrentUserProfiel(): Observable<User> {
    return this.xAuthHttp.get<any>(`${CONFIG.backendBaseUrl}/api/profiles/getprofile`)
      .map(res => res.user)
  }

  update(user: User) {
    return this.xAuthHttp.post(CONFIG.backendBaseUrl + '/api/profiles', user);
  }

}
