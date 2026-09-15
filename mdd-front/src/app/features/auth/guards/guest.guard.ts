import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

/** Protège les routes réservées aux visiteurs : redirige vers le fil d'articles si déjà authentifié. */
export const guestGuard: CanActivateFn = () => {
  const auth = inject(AuthService);
  const router = inject(Router);

  return !auth.isAuthenticated() || router.createUrlTree(['/articles']);
};
