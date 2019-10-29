import { Injectable } from '@angular/core';
import { Auth } from './auth';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private token: string;

  constructor(private http: HttpClient) {
  }

  createUser(email: string, password: string) {
    const user: Auth = { email, password };
    this.http.post<{ message: string, postId: string }>('http://localhost:3000/api/user/signup', user)
      .subscribe((response) => {
        console.log(response);
      });
  }

  login(email: string, password: string) {
    const user: Auth = { email, password };
    this.http.post<{ message: string, token: string }>('http://localhost:3000/api/user/login', user)
      .subscribe((response) => {
        console.log(response);
        this.token = response.token;
      });
  }

  gettoken() {
    return this.token;
  }

}
