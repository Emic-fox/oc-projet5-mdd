import { Component, inject, output } from '@angular/core';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { AuthService } from '@features/auth/services/auth.service';

@Component({
  selector: 'app-private-nav-links',
  imports: [RouterLink, RouterLinkActive],
  host: { class: 'contents' },
  styles: ``,
  template: `
    <button type="button" class="text-red-600 cursor-pointer text-left font-bold" data-testid="logout" (click)="logout()">
      Se déconnecter
    </button>
    <a routerLink="/articles" routerLinkActive="text-primary" class="text-black text-xl" data-testid="nav-articles" (click)="navigate.emit()">
      Articles
    </a>
    <a routerLink="/topics" routerLinkActive="text-primary" class="text-black text-xl" data-testid="nav-topics" (click)="navigate.emit()">
      Thèmes
    </a>
  `,
})
export class PrivateNavLinks {
  /** Émis après une navigation (déconnexion incluse) — sert au parent à fermer le drawer mobile. */
  navigate = output<void>();

  private auth = inject(AuthService);
  private router = inject(Router);

  protected logout(): void {
    this.auth.logout();
    this.navigate.emit();
    this.router.navigate(['']);
  }
}
