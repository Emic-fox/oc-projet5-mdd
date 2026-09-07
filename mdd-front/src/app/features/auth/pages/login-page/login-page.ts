import { Component, DestroyRef, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Router } from '@angular/router';
import { LoginForm, LoginData } from "../../components/login-form/login-form";
import { AuthService } from '../../services/auth.service';
import { ApiError } from '@app/core/errors/api-error';

@Component({
  imports: [LoginForm],
  selector: 'app-login-page',
  template: `
  <app-login-form (submitted)="onLogin($event)" />

  @if (error()) {
    <p class="mt-4 text-center text-sm text-red-600" data-testid="error-messages">{{ error() }}</p>
  }`,
})
export class LoginPage {
  private auth = inject(AuthService);
  private router = inject(Router);
  private destroyRef = inject(DestroyRef);

  protected error = signal<string | null>(null);

  onLogin(credentials: LoginData) {
    this.error.set(null);
    this.auth
      .login(credentials.login, credentials.password)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: () => this.router.navigate(['/']),
        error: (err: ApiError) =>
          this.error.set(
            err.messageFor({ 401: 'Identifiant ou mot de passe incorrect.' }),
          ),
      });
  }
}
