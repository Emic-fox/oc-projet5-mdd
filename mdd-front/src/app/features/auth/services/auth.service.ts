import { computed, DestroyRef, effect, inject, Service, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { tap } from 'rxjs';
import { TokenStore } from './token-store.service';
import { environment } from '@/environments/environment';
import { LoginRequest } from '../models/login-request.interface';
import { RegisterRequest } from '../models/register-request.interface';
import { TokenResponse } from '../models/token-response.interface';
import { MeResponse } from '../models/me-response.interface';
import { MeUpdateResponse } from '../models/me-update-response.interface';
import { MePutRequest } from '../models/me-put-request.interface';
import { MePutPasswordRequest } from '../models/me-put-password-request.interface';

@Service()
export class AuthService {
    private readonly http = inject(HttpClient);
    private readonly tokenStore = inject(TokenStore);
    private readonly destroyRef = inject(DestroyRef);
    private readonly router = inject(Router);

    private readonly path = `${environment.apiUrl}/api/auth`;

    /** Présence d'un token (synchrone) : ne présume rien de la validité de la session côté API. */
    readonly isAuthenticated = computed(() => !!this.tokenStore.token());
    private readonly currentUser = signal<MeResponse | null>(null);

    /** Utilisateur authentifié courant (null si déconnecté ou pas encore chargé). */
    readonly user = this.currentUser.asReadonly();

    constructor() {
        // Comportement à la déconnexion (exemple : token indiqué comme invalide par l'API)
        let wasAuthenticated = this.isAuthenticated();
        effect(() => {
            const authenticated = this.isAuthenticated();
            if (wasAuthenticated && !authenticated) {
                this.currentUser.set(null);
                this.router.navigate(['/']);
            }
            wasAuthenticated = authenticated;
        });

        if (this.isAuthenticated()) {
            this.refreshUser();
        }
    }

    getCurrentUser() {
        return this.currentUser();
    }

    getToken() {
        return this.tokenStore.token();
    }

    private _setToken(token: string | null) {
        this.tokenStore.set(token);
        if (token) {
            this.refreshUser();
        }
    }

    login(login: string, password: string) {
        const request: LoginRequest = { login, password };
        return this.http.post<TokenResponse>(`${this.path}/login`, request).pipe(
            tap((response) => {
                this._setToken(response.token);
            })
        );
    }

    register(username: string, email: string, password: string) {
        const request: RegisterRequest = { username, email, password };
        return this.http.post<TokenResponse>(`${this.path}/register`, request).pipe(
            tap((response) => {
                this._setToken(response.token);
            })
        );
    }

    updateProfile(username: string, email: string) {
        const request: MePutRequest = { username, email };
        // Le token précédent porte l'ancien username en sujet : il devient invalide
        // si celui-ci change, l'API renvoie donc un nouveau token, accompagné de
        // l'utilisateur à jour : inutile de rappeler /me pour le recharger.
        return this.http.put<MeUpdateResponse>(`${this.path}/me`, request).pipe(
            tap((response) => {
                this.tokenStore.set(response.token);
                this.currentUser.set(response.user);
            })
        );
    }

    updatePassword(newPassword: string) {
        const request: MePutPasswordRequest = { newPassword };
        return this.http.put(`${this.path}/me/password`, request);
    }

    logout() {
        this._setToken(null);
    }

    refreshUser() {
        if (!this.isAuthenticated()) {
            return;
        }

        this.http
            .get<MeResponse>(`${this.path}/me`)
            .pipe(takeUntilDestroyed(this.destroyRef))
            .subscribe({
                next: (user) => this.currentUser.set(user),
                // Token présent mais rejeté par l'API (expiré / invalide) : on nettoie la session.
                error: () => this._setToken(null),
            });
    }
}
