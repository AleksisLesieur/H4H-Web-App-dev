import { Injectable } from '@angular/core';
import { ApiService, SharedService } from '../../services';
import { Observable } from 'rxjs';
import { LocalStorageService } from 'ngx-localstorage';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(
    private apiservice: ApiService,
    private sharedService: SharedService,
    private router: Router,
    private localStorage: LocalStorageService
  ) { }

  checkUserAccess(payload): Observable<any> {
    return this.apiservice.post('user-check', payload);
  }
  logout() {
    this.router.navigate(['/auth/login']);
    this.localStorage.set('token', '');
    this.localStorage.set('sub_id', '');
    this.localStorage.set('user_type', '0');
    this.sharedService.changeMessage('0');
  }
}
