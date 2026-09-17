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
  <app-login-form [globalError]="error()" (submitted)="onLogin($event)" />`,
})
export class LoginPage {
  private readonly auth = inject(AuthService);
  private readonly router = inject(Router);
  private readonly destroyRef = inject(DestroyRef);

  protected readonly error = signal<string | null>(null);

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
