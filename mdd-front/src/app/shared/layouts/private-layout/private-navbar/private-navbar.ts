import { Component, signal } from '@angular/core';
import { Logo } from '@/app/shared/components/logo/logo';
import { PrivateNavLinks } from './private-nav-links/private-nav-links';
import { PrivateNavAvatar } from './private-nav-avatar/private-nav-avatar';

@Component({
  imports: [Logo, PrivateNavLinks, PrivateNavAvatar],
  selector: 'app-private-navbar',
  styles: ``,
  template: `<header class="relative border-b border-gray-200 bg-white px-4 py-3 flex items-center justify-between">
    <app-logo size="small" />

    <!-- Menu desktop -->
    <div class="hidden md:flex items-center gap-6">
      <app-private-nav-links />
      <app-private-nav-avatar />
    </div>

    <!-- Bouton pour ouvrir le menu mobile -->
    <button
      type="button"
      class="md:hidden cursor-pointer"
      data-testid="menu-toggle"
      [attr.aria-expanded]="isMenuOpen()"
      aria-label="Ouvrir le menu"
      (click)="toggleMenu()"
    >
      <img src="assets/icons/menu.svg" alt="Profil" class="h-4 w-6" />
    </button>

    <!-- Menu mobile -->
    @if (isMenuOpen()) {
      <div class="fixed inset-0 z-40 bg-black/40 md:hidden" data-testid="menu-backdrop" (click)="closeMenu()"></div>

      <div
        class="fixed inset-y-0 right-0 z-50 w-3/4 max-w-xs bg-white shadow-lg flex flex-col justify-between p-6 md:hidden"
        data-testid="mobile-menu"
      >
        <div class="flex flex-col items-end gap-6">
          <app-private-nav-links (navigate)="closeMenu()" />
        </div>
        <app-private-nav-avatar (navigate)="closeMenu()" />
      </div>
    }
  </header>`,
})
export class PrivateNavbar {
  protected readonly isMenuOpen = signal(false);

  protected toggleMenu(): void {
    this.isMenuOpen.update((v) => !v);
  }

  protected closeMenu(): void {
    this.isMenuOpen.set(false);
  }
}
