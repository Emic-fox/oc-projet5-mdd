import { Component, DestroyRef, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Router } from '@angular/router';
import { RegisterForm, RegisterData } from "../../components/register-form/register-form";
import { AuthService } from '../../services/auth.service';
import { ApiError } from '@app/core/errors/api-error';

@Component({
  imports: [RegisterForm],
  selector: 'app-register-page',
  template: `
  <app-register-form (submitted)="onRegister($event)" />

  @if (error()) {
    <p class="mt-4 text-center text-sm text-red-600">{{ error() }}</p>
  }`,
})
export class RegisterPage {
  private auth = inject(AuthService);
  private router = inject(Router);
  private destroyRef = inject(DestroyRef);

  protected error = signal<string | null>(null);

  onRegister(data: RegisterData) {
    this.error.set(null);
    this.auth
      .register(data.username, data.email, data.password)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: () => this.router.navigate(['/']),
        error: (err: ApiError) => this.error.set(err.message),
      });
  }
}
