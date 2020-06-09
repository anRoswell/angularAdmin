import { Router } from '@angular/router';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { Login } from './../models/login';
import { User } from './../models/user';
import { StorageService } from './storage.service';

import { environment } from './../../environments/environment';
const { server } = environment;

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  api = `${server}api/v1.0`;
  constructor(
    private http: HttpClient,
    private storage: StorageService,
    private router: Router
  ) {}

  auth(data: Login): Observable<User> {
    return this.http.post<User>(`${this.api}/auth`, data);
  }

  isAuth(): boolean {
    return !!this.storage.one('_user');
  }

  logout() {
    this.storage.clear();
    this.router.navigate(['/login']);
  }
}
