import { Component, DestroyRef, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Router } from '@angular/router';
import { ProfileForm, ProfileFormData } from "@shared/components/forms/profile-form/profile-form";
import { AuthService } from '../../services/auth.service';
import { ApiError } from '@app/core/errors/api-error';

@Component({
  imports: [ProfileForm],
  selector: 'app-register-page',
  template: `
  <app-profile-form submitLabel="S'inscrire" (submitted)="onRegister($event)" />

  @if (error()) {
    <p class="mt-4 text-center text-sm text-red-600" data-testid="api-error">{{ error() }}</p>
  }`,
})
export class RegisterPage {
  private auth = inject(AuthService);
  private router = inject(Router);
  private destroyRef = inject(DestroyRef);

  protected error = signal<string | null>(null);

  onRegister(data: ProfileFormData) {
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
