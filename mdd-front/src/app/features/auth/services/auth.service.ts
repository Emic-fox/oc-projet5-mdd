import { computed, DestroyRef, inject, Service, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { tap } from 'rxjs';
import { TokenStore } from './token-store.service';
import { environment } from '@/environments/environment';
import { LoginRequest } from '../models/login-request.interface';
import { RegisterRequest } from '../models/register-request.interface';
import { TokenResponse } from '../models/token-response.interface';
import { MeResponse } from '../models/me-response.interface';

@Service()
export class AuthService {
    private http = inject(HttpClient);
    private tokenStore = inject(TokenStore);
    private destroyRef = inject(DestroyRef);

    private path = `${environment.apiUrl}/api/auth`;

    private isConnected = computed(() => !!this.tokenStore.token());
    private currentUser = signal<MeResponse | null>(null);

    /** Utilisateur authentifié courant (null si déconnecté ou pas encore chargé). */
    readonly user = this.currentUser.asReadonly();

    constructor() {
        if (this.isConnected()) {
            this._loadUser();
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
            this._loadUser();
        } else {
            this.currentUser.set(null);
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

    logout() {
        this._setToken(null);
    }

    private _loadUser() {
        if (!this.isConnected()) {
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
