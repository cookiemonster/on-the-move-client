import {Injectable} from '@angular/core';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';

import {Observable} from 'rxjs/Observable';
import {Expertise} from "../models/expertise";
import {CONFIG} from "../../app-config";
import {XAuthHttpProvider} from "./helpers/x-auth-http.provider";

@Injectable()
export class ExpertiseProvider {
  private static baseUrl: string = `${CONFIG.backendBaseUrl}/api/expertise`;

  constructor(private http: XAuthHttpProvider) {
  }

  getUserExpertises(): Observable<Expertise[]> {
    return this.http.get<Expertise[]>(`${ExpertiseProvider.baseUrl}`);
  }

  getExpertises(userId: number): Observable<Expertise[]> {
    return this.http.get<any>(`${ExpertiseProvider.baseUrl}/${userId}`)
      .map(res => res.expertises);
  }

  addExpertise(expertise: string) {
    return this.http.post(`${ExpertiseProvider.baseUrl}/store`, expertise);
  }

  removeExpertise(expertise: Expertise) {
    return this.http.delete(`${ExpertiseProvider.baseUrl}/${expertise.id}`);
  }

}
