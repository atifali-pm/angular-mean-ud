import { Injectable } from '@angular/core';
import { Auth } from './auth';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { from, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private token: string;
  private isAuthenticated = false;
  private authStatus = new Subject<boolean>();
  // @ts-ignore
  private tokenTimer: NodeJS.Timer;

  constructor(private http: HttpClient, private router: Router) {
  }

  createUser(email: string, password: string) {
    const user: Auth = { email, password };
    this.http.post<{ message: string, postId: string }>('http://localhost:3000/api/user/signup', user)
      .subscribe((response) => {
        console.log(response);
      });
  }


  login(email: string, password: string) {
    const authData: Auth = { email, password };
    this.http
      .post<{ token: string; expiresIn: number }>(
        'http://localhost:3000/api/user/login',
        authData
      )
      .subscribe(response => {
        const token = response.token;
        this.token = token;
        if (token) {
          const expiresInDuration = response.expiresIn;
          this.setAuthTimer(expiresInDuration);
          this.isAuthenticated = true;
          this.authStatus.next(true);
          const now = new Date();
          const expirationDate = new Date(now.getTime() + expiresInDuration * 1000);
          console.log(expirationDate);
          this.saveAuthData(token, expirationDate);
          this.router.navigate([ '/' ]);
        }
      });
  }


  autoAuthUser() {
    if (!this.getAuthData()) {
      return;
    }
    const authInfo = this.getAuthData();
    const now = new Date();
    const expiresIn = authInfo.expirationDate.getTime() - now.getTime();
    console.log(authInfo);

    if (expiresIn > 0) {
      this.token = authInfo.token;
      this.isAuthenticated = true;
      this.authStatus.next(true);
      this.setAuthTimer(expiresIn / 1000);
    }

  }

  logout() {
    this.isAuthenticated = false;
    this.authStatus.next(false);
    clearTimeout(this.tokenTimer);
    this.clearAuthData();
    this.router.navigate([ '/login' ]);
  }

  private setAuthTimer(duration: number) {
    console.log('Setting timer: ' + duration);
    this.tokenTimer = setTimeout(() => {
      this.logout();
    }, duration * 1000);
  }


  getIsAuth() {
    return this.isAuthenticated;
  }


  getAuthStatus() {
    return this.authStatus;
  }

  gettoken() {
    return this.token;
  }

  private saveAuthData(token: string, expirationDate: Date) {
    localStorage.setItem('token', token);
    localStorage.setItem('expiration', expirationDate.toISOString());
  }

  private clearAuthData() {
    localStorage.removeItem('token');
    localStorage.removeItem('expiration');
  }

  private getAuthData() {
    const token = localStorage.getItem('token');
    const expirationDate = localStorage.getItem('expiration');

    if (!token || !expirationDate) {
      return false;
    }

    return {
      token,
      expirationDate: new Date(expirationDate)
    };
  }

}
