import { Injectable } from '@angular/core';
import {
  HttpClient,
  HttpRequest,
  HttpResponse,
  HttpErrorResponse,
  HttpParams,
  HttpHeaders
} from '@angular/common/http';

import { environment } from "../../../environments/environment";
import { Observable, throwError } from 'rxjs';
import { catchError, retry } from 'rxjs/operators';
import { LocalStorageService } from 'ngx-localstorage';
import { SharedService } from '../../services';
import { Router } from '@angular/router';

const API_BASE_URL = environment.apiUrl;

export interface Payload { }

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private endPoint: string;
  constructor(
    private http: HttpClient,
    private localStorage: LocalStorageService,
    private sharedService: SharedService,
    private router: Router,
  ) { }

  isUserLoggedIn(): boolean {
    if (this.localStorage.get('token')) {
      return true;
    } else {
      return false;
    }
  }

  setApiEndpoint(route: string): void {
    this.endPoint = API_BASE_URL + "/" + route;
  }
  getApiEndPoint(): string {
    return this.endPoint;
  }

  getDefaultHeaders(): HttpHeaders {
    let defaultHeaders = new HttpHeaders();
    defaultHeaders = defaultHeaders.set('Content-Type', 'application/json');
    defaultHeaders = defaultHeaders.set('Authorization', 'Bearer ' + this.localStorage.get('token'));
    return defaultHeaders;
  }

  payloadToQueryParams(paramsPayload: Payload): HttpParams {
    let querParams = new HttpParams();
    for (let key in paramsPayload) {
      if (paramsPayload.hasOwnProperty(key)) {
        querParams = querParams.append(key, paramsPayload[key]);
      }
    }
    return querParams;
  }

  get(route: string, paramsPayload: Payload): Observable<any> {
    this.setApiEndpoint(route);

    return this.http.get(this.getApiEndPoint()).pipe(
      catchError(this.handleError.bind(this))
    );
  }

  generatePayload(paramsPayload) {
    paramsPayload.current_user = {
      user_sub_Id: this.localStorage.get('sub_id') ? this.localStorage.get('sub_id') : '',
      user_type: this.localStorage.get('user_type') ? this.localStorage.get('user_type') : ''
    }
    return paramsPayload;

  }

  post(route: string, paramsPayload: Payload): Observable<any> {
    this.setApiEndpoint(route);
    let httpRequestOptions = { headers: this.getDefaultHeaders() };
    if (this.isUserLoggedIn) {
      httpRequestOptions['withCredentials'] = false;
    }
    return this.http.post(this.getApiEndPoint(), this.generatePayload(paramsPayload), httpRequestOptions).pipe(
      catchError(this.handleError.bind(this))
    );
  }

  put(route: string, paramsPayload: Payload): Observable<any> {
    this.setApiEndpoint(route);
    let httpRequestOptions = { headers: this.getDefaultHeaders() };
    if (this.isUserLoggedIn) {
      httpRequestOptions['withCredentials'] = false;
    }
    return this.http.put(this.getApiEndPoint(), this.generatePayload(paramsPayload), httpRequestOptions).pipe(
      catchError(this.handleError.bind(this))
    );
  }

  delete(route: string): Observable<any> {
    this.setApiEndpoint(route);
    return this.http.delete(this.getApiEndPoint());
  }

  private handleError(error: HttpErrorResponse) {
    if (error.error instanceof ErrorEvent) {
      // A client-side or network error occurred. Handle it accordingly.
      console.error('An error occurred:', error.error.message);
    } else {
      // The backend returned an unsuccessful response code.
      // The response body may contain clues as to what went wrong,
      console.error('Backend returned code :', error.status);

      if (error.status === 401 || error.status === 500 || error.status === 0) {
        this.logout();
        return throwError(
          'Your session has expired. Please log in again.');

      } else {
        return throwError(
          'Something went wrong!');
      }
    }
  };

  logout() {
    this.router.navigate(['/auth/login']);
    this.localStorage.set('token', '');
    this.localStorage.set('sub_id', '');
    this.localStorage.set('user_type', '0');
    this.sharedService.changeMessage('0');
  }
}
