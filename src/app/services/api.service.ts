import { User } from './../models/user';
import { Login } from './../models/login';
import { HttpClient } from '@angular/common/http';
import { environment } from './../../environments/environment';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

const { server } = environment;

@Injectable({
  providedIn: 'root',
})
export class ApiService {
  api = `${server}api/v1.0`;
  constructor(private http: HttpClient) {}

  auth(data: Login): Observable<User> {
    return this.http.post<User>(`${this.api}/auth`, data);
  }
}
