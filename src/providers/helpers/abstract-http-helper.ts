import {HttpClient, HttpHeaders} from "@angular/common/http";
import {Observable} from "rxjs/Observable";

/*
  Abstract http helper class
  This class can be used to create a http provider for a specific data provider. It uses the HttpClient to make api
  calls. Implement het abstract getHeaders method to add a token to the headers.
 */

export abstract class AbstractHttpHelper{

  constructor(private http: HttpClient){
  }

  public get<T>(url: string): Observable<T>{
    return this.getHeaders()
      .switchMap(headers => this.http.get<T>(url, {headers: headers}));
  }

  public post<T>(url: string, body: any): Observable<T>{
    return this.getHeaders()
      .switchMap(headers => this.http.post<T>(url, body, {headers: headers}));
  }

  public put<T>(url: string, body: any): Observable<T>{
    return this.getHeaders()
      .switchMap(headers => this.http.put<T>(url, body, {headers: headers}));
  }

  public delete<T>(url: string): Observable<T>{
    return this.getHeaders()
      .switchMap(headers => this.http.delete<T>(url, {headers: headers}))
  }

  abstract getHeaders(): Observable<HttpHeaders>;

}
