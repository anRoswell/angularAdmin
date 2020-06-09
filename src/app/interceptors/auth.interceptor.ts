import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpResponse,
  HttpErrorResponse,
} from '@angular/common/http';
import { Observable, of, throwError } from 'rxjs';
import { map, switchMap, share, catchError } from 'rxjs/operators';
import { StorageService } from '../services/storage.service';
import { Router } from '@angular/router';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  constructor(private storage: StorageService, private router: Router) {}

  intercept(
    request: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    // return next.handle(request);

    return of(this.storage.one('_token')).pipe(
      switchMap((token: any) => {
        if (token) {
          request = request.clone({
            setHeaders: {
              Authorization: `Bearer ${token}`,
            },
          });
        } else {
          return next.handle(request).pipe(
            share(),
            map((event: HttpEvent<any>) => {
              console.log(event);
              if (event instanceof HttpResponse) {
                console.log(event.headers.get('authorization'));
                token = event.headers.get('authorization');
                if (token) {
                  this.storage.create('_auth', token);
                }
              }
              return event;
            }),
            catchError((errorResponse: HttpErrorResponse) => {
              const { status } = errorResponse;
              if ([401, 403].includes(status)) {
                this.storage.clear();
                this.router.navigate(['/login']);
              }
              return throwError(errorResponse);
            })
          );
        }
      })
    );
  }
}
