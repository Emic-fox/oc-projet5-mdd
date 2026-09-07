import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { Logo } from "@shared/components/logo/logo";
import { Button } from "@shared/components/button/button";
import { AuthService } from '@features/auth/services/auth.service';

@Component({
  imports: [Logo, Button],
  selector: 'app-home-page',
  host: { class: 'flex min-h-dvh flex-col items-center justify-center' },
  template: `
  <main class="flex flex-col items-center gap-10">
    <app-logo size="large" />

    @if (auth.user(); as user) {
      <p class="text-xl font-semibold">Bienvenue {{ user.username }}</p>
      <app-button variant="secondary" class="w-full md:w-auto" (click)="logout()">Se déconnecter</app-button>
    } @else {
      <div class="px-8 flex w-full flex-col gap-8 md:flex-row md:items-center md:justify-between md:gap-0">
        <app-button variant="secondary" class="w-full md:w-auto" (click)="goTo('login')">Se connecter</app-button>
        <app-button variant="secondary" class="w-full md:w-auto" (click)="goTo('register')">S'inscrire</app-button>
      </div>
    }
  </main>
  `,
})
export class HomePage {
  protected auth = inject(AuthService);
  private router = inject(Router);

  goTo(page: 'login' | 'register') {
    this.router.navigate([`/${page}`]);
  }

  logout() {
    this.auth.logout();
  }
}
