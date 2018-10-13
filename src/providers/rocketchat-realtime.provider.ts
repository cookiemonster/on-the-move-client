import {Injectable} from "@angular/core";
import {Observable} from "rxjs/Observable";
import {Subject} from "rxjs/Subject";
import {CONFIG} from "../../app-config";

@Injectable()
export class RocketchatRealtimeProvider {

  private subject: Subject<any>;
  private result: Observable<any>;

  /*
  This class is used for the websocket connection. It makes a conection in the constuctor and keeps the connection
  active by send 'pong' on every incoming ping. Implemented methods return an Observable with the result. This is done
  by generation an almost unique ID and sending it in the websocket request. Note: when implmenting realtime methods
  mae sure to add `.take(1)` to the stream to prevent ongoing subscriptions.
   */

  // This class is used for the websocket connection.

  constructor(){
    // Simple websocketcode
    this.subject = Observable.webSocket(CONFIG.rocketchatWebsocketUrl);
    this.result = this.subject.retry().share();

    // ping pong to keep connection alive
    this.result
      .filter(res => res.msg === "ping")
      .subscribe(() => {
        this.subject.next(JSON.stringify({msg: 'pong'}));
      });

    this.subject.next("{\"msg\": \"connect\", \"version\": \"1\", \"support\": [\"1\"]}"); // Start ws
  }

  //Create an almost unique ID for a ws request.
  static newGuid() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
      let r = Math.random()*16|0, v = c == 'x' ? r : (r&0x3|0x8);
      return v.toString(16);
    });
  }

  sendForgotPasswordEmail(email: string): Observable<any>{
    let guid: string = RocketchatRealtimeProvider.newGuid();
    let o = {
      "msg": "method",
      "method": "sendForgotPasswordEmail",
      "id": guid,
      "params": [email]
    };
    this.subject.next(JSON.stringify(o));
    return this.result
      .filter((res: any) =>  res.id === guid)
      .take(1)
  }

}
