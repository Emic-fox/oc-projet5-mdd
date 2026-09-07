import { Service, signal } from '@angular/core';

/**
 * Détient uniquement le token d'authentification (signal + persistance).
 * Aucune dépendance : peut être injecté par l'intercepteur HTTP sans créer
 * de dépendance circulaire avec AuthService / HttpClient.
 */
@Service()
export class TokenStore {
    private _token = signal<string | null>(localStorage.getItem('token'));

    readonly token = this._token.asReadonly();

    set(token: string | null) {
        this._token.set(token);
        if (token) {
            localStorage.setItem('token', token);
        } else {
            localStorage.removeItem('token');
        }
    }
}
