import { Component, computed, inject, output } from '@angular/core';
import { Router, RouterLink, isActive } from '@angular/router';

@Component({
  selector: 'app-private-nav-avatar',
  imports: [RouterLink],
  host: { class: 'contents' },
  template: `
    <a routerLink="/profile" data-testid="nav-profile" class="flex justify-end" (click)="navigate.emit()">
      <img
        [src]="isProfileActive() ? 'assets/icons/user-active.svg' : 'assets/icons/user.svg'"
        alt="Profil"
        class="h-9 w-9"
      />
    </a>
  `,
})
export class PrivateNavAvatar {
  navigate = output<void>();
  private readonly router = inject(Router);

  isProfileActive = isActive('/profile', this.router);
}
