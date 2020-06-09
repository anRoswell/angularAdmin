import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';

import { StorageService } from './../../services/storage.service';
import { AuthService } from './../../services/auth.service';
import { Login } from './../../models/login';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit {
  form: FormGroup;
  hasError: boolean;
  errorMessage: string;

  constructor(
    private fb: FormBuilder,
    private auth: AuthService,
    private storage: StorageService,
    private router: Router
  ) {}

  ngOnInit(): void {
    if (this.auth.isAuth()) {
      this.router.navigate(['/admin']);
    } else {
      this.hasError = false;
      this.form = this.fb.group({
        username: ['', [Validators.required]],
        access: ['', [Validators.required]],
      });
    }
  }

  isValid(field: string): boolean {
    const f = this.form.get(field);
    return f.invalid && (f.dirty || f.touched);
  }

  login() {
    if (this.form.valid) {
      const login = new Login(
        this.form.get('username').value,
        this.form.get('access').value
      );

      if (login.isValid()) {
        this.auth.auth(login).subscribe(
          (user) => {
            this.storage.create('_user', user);
            this.router.navigate(['/admin']);
          },
          ({ error }) => {
            if (error) {
              this.hasError = true;
              this.errorMessage = error.error;
              setTimeout(() => {
                this.hasError = false;
                this.errorMessage = '';
              }, 3000);
            }
          }
        );
      }
    }
  }
}
