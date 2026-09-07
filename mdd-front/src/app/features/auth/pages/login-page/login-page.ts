import { Component, DestroyRef, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { HttpErrorResponse } from '@angular/common/http';
import { Router } from '@angular/router';
import { LoginForm, LoginData } from "../../components/login-form/login-form";
import { AuthService } from '../../services/auth.service';
import { ProblemDetail } from '@app/core/models/problem-detail.interface';

@Component({
  imports: [LoginForm],
  selector: 'app-login-page',
  template: `
  <app-login-form (submitted)="onLogin($event)" />

  @if (error()) {
    <p class="mt-4 text-center text-sm text-red-600">{{ error() }}</p>
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
        error: (err: HttpErrorResponse) => this.error.set(this.errorMessage(err)),
      });
  }

  private errorMessage(err: HttpErrorResponse): string {
    if (err.status === 0) {
      return 'Impossible de contacter le serveur. Veuillez réessayer plus tard.';
    }
    if (err.status === 401) {
      return 'Identifiant ou mot de passe incorrect.';
    }
    const problem = err.error as ProblemDetail | null;
    return problem?.detail || 'Une erreur est survenue. Veuillez réessayer.';
  }
}
