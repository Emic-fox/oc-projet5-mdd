import { isDevMode, Service } from '@angular/core';

/**
 * Point d'entrée unique du reporting d'erreurs.
 * 
 * Pour le moment, console.error en dév seulement.
 * À terme, remplacer par un vrai gestionnaire d'erreurs comme Sentry.
 */
@Service()
export class Logger {
  error(message: string, cause?: unknown): void {
    if (isDevMode()) console.error(`[MDD] ${message}`, cause);
  }
}
