import { Injectable } from '@angular/core';
import { CanActivate } from '@angular/router';
import { AuthService } from '../../services';
import { LocalStorageService } from 'ngx-localstorage';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthGuardService implements CanActivate {
  constructor(
    private router: Router,
    private localStorage: LocalStorageService,
    private authService: AuthService,
  ) { }

  canActivate(): boolean {
    let canUserAccessRoute: boolean = this.validateToken();
    if (!canUserAccessRoute) {
      this.authService.logout();
    }
    return canUserAccessRoute;
  }

  validateToken() {
    const token = this.localStorage.get('token');
    const userType = this.localStorage.get('user_type');
    if (token && userType == '1') {
      return true;
    } else {
      return false;
    }
  }
}
