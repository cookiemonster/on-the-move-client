import {AbstractHttpHelper} from "./abstract-http-helper";
import {Observable} from "rxjs/Observable";
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {Injectable} from "@angular/core";
import {CurrentUserService} from "../current-user.service";
import "rxjs/add/observable/combineLatest";

/*
  Helper class for making api calls to Rocketchat. Use this class to make the api callss instead of the HttpClient.
  It automatically adds authorization headers to the requests
 */

@Injectable()
export class XAuthHttpProvider extends AbstractHttpHelper {


  constructor(http: HttpClient,
              private currentUserService: CurrentUserService) {
    super(http);
  }

  getHeaders(): Observable<HttpHeaders> {
    return Observable.combineLatest(this.currentUserService.$rocketchatUserId, this.currentUserService.$rocketchatUserToken)
      .take(1)
      .map(idAndToken =>
        new HttpHeaders()
          .set('X-User-Id', idAndToken[0])
          .set('X-Auth-Token', idAndToken[1])
      );
  }


}
