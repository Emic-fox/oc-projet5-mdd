import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { catchError, throwError } from 'rxjs';
import { ApiError } from './api-error';
import { Logger } from '@app/core/services/logger.service';

/**
 * Convertit toute `HttpErrorResponse` en `ApiError` normalisée.
 *
 * À enregistrer en dernier dans `withInterceptors([...])` : les interceptors
 * en amont (auth : 401 -> logout) voient encore la `HttpErrorResponse` brute.
 *
 * Journalise chaque erreur ici, centralement, qu'une page la gère ou non.
 */
export const apiErrorInterceptor: HttpInterceptorFn = (req, next) => {
    const logger = inject(Logger);

    return next(req).pipe(
        catchError((err) => {
            const apiError = err instanceof HttpErrorResponse ? ApiError.from(err) : err;
            if (apiError instanceof ApiError) {
                logger.error(`${req.method} ${req.url} failed`, apiError);
            }
            return throwError(() => apiError);
        }),
    );
};
