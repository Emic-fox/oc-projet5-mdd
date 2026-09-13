import { Component, output } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-private-nav-avatar',
  imports: [RouterLink],
  host: { class: 'contents' },
  styles: ``,
  template: `
    <a routerLink="/profile" data-testid="nav-profile" class="flex justify-end" (click)="navigate.emit()">
      <img src="assets/icons/user.svg" alt="Profil" class="h-9 w-9" />
    </a>
  `,
})
export class PrivateNavAvatar {
  navigate = output<void>();
}
