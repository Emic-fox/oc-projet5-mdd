import { HttpInterceptorFn } from '@angular/common/http';
import { TokenStore } from '../services/token-store.service';
import { inject } from '@angular/core';
import { catchError, throwError } from 'rxjs';

/** Endpoints publics : un 401 dessus signale des identifiants invalides, pas une session expirée. */
const PUBLIC_AUTH_PATHS = ['/api/auth/login', '/api/auth/register'];

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const tokenStore = inject(TokenStore);
  const token = tokenStore.token();

  if (token) {
    req = req.clone({
      headers: req.headers.set('Authorization', `Bearer ${token}`),
    });
  }

  return next(req).pipe(
    catchError((err) => {
      const isPublicAuthPath = PUBLIC_AUTH_PATHS.some((path) => req.url.endsWith(path));
      // `err` peut être une HttpErrorResponse brute ou déjà une ApiError normalisée en aval
      // (apiErrorInterceptor) : les deux exposent `status`.
      const status = (err as { status?: number })?.status;

      if (token && !isPublicAuthPath && status === 401) {
        tokenStore.set(null);
      }

      return throwError(() => err);
    }),
  );
};
