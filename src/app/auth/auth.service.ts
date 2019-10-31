import { Injectable } from '@angular/core';
import { Auth } from './auth';
import { HttpClient } from '@angular/common/http';
import { Router, UrlTree } from '@angular/router';
import { from, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private token: string;
  private isAuthenticated = false;
  // @ts-ignore
  private tokenTimer: NodeJS.Timer;
  private userId: string;

  private authStatus = new Subject<boolean>();

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
      .post<{ token: string; expiresIn: number, userId: string }>(
        'http://localhost:3000/api/user/login',
        authData
      )
      .subscribe(response => {
        const token = response.token;
        this.token = token;
        if (token) {
          const expiresInDuration = response.expiresIn;
          this.userId = response.userId;
          this.setAuthTimer(expiresInDuration);
          this.isAuthenticated = true;
          this.authStatus.next(true);
          const now = new Date();
          const expirationDate = new Date(now.getTime() + expiresInDuration * 1000);
          console.log(expirationDate);
          this.saveAuthData(token, expirationDate, this.userId);
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
      this.userId = authInfo.userId;
      this.authStatus.next(true);
      this.setAuthTimer(expiresIn / 1000);
    }

  }

  logout() {
    this.isAuthenticated = false;
    this.authStatus.next(false);
    clearTimeout(this.tokenTimer);
    this.clearAuthData();
    this.userId = null;
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

  getUserId(){
    return this.userId;
  }


  getAuthStatus() {
    return this.authStatus;
  }

  gettoken() {
    return this.token;
  }

  private saveAuthData(token: string, expirationDate: Date, userId: string) {
    localStorage.setItem('token', token);
    localStorage.setItem('expiration', expirationDate.toISOString());
    localStorage.setItem('userId', userId);
  }

  private clearAuthData() {
    localStorage.removeItem('token');
    localStorage.removeItem('expiration');
    localStorage.removeItem('userId');
  }

  private getAuthData() {
    const token = localStorage.getItem('token');
    const expirationDate = localStorage.getItem('expiration');
    const userId = localStorage.getItem('userId');

    if (!token || !expirationDate) {
      return;
    }

    return {
      token,
      expirationDate: new Date(expirationDate),
      userId
    };
  }

}
