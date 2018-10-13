import {Injectable} from "@angular/core";
import {Observable} from "rxjs/Observable";
import {XAuthHttpProvider} from "./helpers/x-auth-http.provider";
import {RocketChatUser} from "../models/rocket-chat-user";
import {CONFIG} from "../../app-config";
import * as shajs from 'sha.js';
import {HttpClient} from "@angular/common/http";

@Injectable()
export class RocketchatUserProvider {


  private static baseUrl: string = `${CONFIG.rocketchatBaseUrl}/api/v1`;

  constructor(private http: XAuthHttpProvider,
              private httpClient: HttpClient) {
  }

  public searchUsers(name: string, filterUsers: string[]): Observable<RocketChatUser[]> {
    return this.http.get<any>(`${RocketchatUserProvider.baseUrl}/users.list?count=5&query={"$and":[{"username": {"$regex": "${name}"}},{"username": {"$nin": ${JSON.stringify(filterUsers)}}}]}`)
    // return this.http.get<any>(`${RocketchatUserProvider.baseUrl}/users.list?count=5&query={"name": {"$regex": "rob", "$options": "i"}}`)
      .map(res => res.users);
  }

  public storePushToken(token: string){
    return this.http.post<any>(`${RocketchatUserProvider.baseUrl}/push.token`, { type: "gcm", value: token, appName: "on.the.move" });
  }

  public getCurrentRocketchatUser(): Observable<RocketChatUser>{
    return this.http.get<any>(`${RocketchatUserProvider.baseUrl}/me`);
  }

  public getRocketchatUser(id: string): Observable<RocketChatUser>{
    return this.http.get<any>(`${RocketchatUserProvider.baseUrl}/users.info?userId=${id}`)
      .map(res => res.user);
  }

  public changePassword(oldPassword: string, newPassword: string){
    let hashedOldPassword = shajs('sha256').update(oldPassword).digest('hex');
    let body = {
      data: {
        newPassword: newPassword,
        currentPassword: hashedOldPassword
      }
    };
    return this.http.post<any>(`${RocketchatUserProvider.baseUrl}/users.updateOwnBasicInfo`, body)
  }

  signup(accountInfo: {username: string, email: string, pass: string, name: string}): Observable<RocketChatUser> {
    return this.httpClient.post<any>(`${RocketchatUserProvider.baseUrl}/users.register`, accountInfo)
      .map(res => res.user);
  }

  login(accountInfo: {
    user: string, password: string
  }): Observable<{ status: string, data: {authToken: string, userId: string} }> {
    return this.httpClient.post<{ status: string, data: {authToken: string, userId: string} }>(`${RocketchatUserProvider.baseUrl}/login`, accountInfo);
  }

  getPermissions(){
    return this.http.get<any>(`${RocketchatUserProvider.baseUrl}/permisssions`);
  }


}
