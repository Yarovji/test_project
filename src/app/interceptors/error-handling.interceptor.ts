import { inject, Injectable } from '@angular/core';
import { Router } from '@angular/router';
import {
  HttpErrorResponse,
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest,
} from '@angular/common/http';

import { EMPTY, Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

import { HTTP_STATUS_CODE } from '../enums/http-status-code.enum';

@Injectable({
  providedIn: 'root',
})
export class ErrorHandlingInterceptor implements HttpInterceptor {
  private router = inject(Router);

  public intercept(
    httpRequest: HttpRequest<unknown>,
    next: HttpHandler,
  ): Observable<HttpEvent<unknown>> {
    return next.handle(httpRequest).pipe(
      catchError((error: HttpErrorResponse) => {
        if (error.status === HTTP_STATUS_CODE.FORBIDDEN) {
          this.router.navigate(['/some_FORBIDDEN_page']);
          return EMPTY;
        } else if (error.status === HTTP_STATUS_CODE.NOT_FOUND) {
          this.router.navigate(['/some_NOT_FOUND_page']);
          return EMPTY;
        }
        return throwError(() => error);
      }),
    );
  }
}
