import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { catchError, throwError } from 'rxjs';
import { ApiError } from './api-error';

/**
 * Convertit toute `HttpErrorResponse` en `ApiError` normalisée.
 *
 * À enregistrer en dernier dans `withInterceptors([...])` : les interceptors
 * en amont (auth : 401 -> logout) voient encore la `HttpErrorResponse` brute.
 */
export const apiErrorInterceptor: HttpInterceptorFn = (req, next) =>
    next(req).pipe(
        catchError((err) =>
            throwError(() =>
                err instanceof HttpErrorResponse ? ApiError.from(err) : err,
            ),
        ),
    );
