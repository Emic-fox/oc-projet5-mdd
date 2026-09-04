import { Component } from '@angular/core';
import { Logo } from "../../../../shared/components/logo/logo";
import { Button } from "../../../../shared/components/button/button";

@Component({
  imports: [Logo, Button],
  selector: 'app-home-page',
  styles: ``,
  host: { class: 'flex min-h-dvh flex-col items-center justify-center' },
  template: `
  <main class="flex flex-col items-center gap-10">
    <app-logo size="large" />
    <div class="px-8 flex w-full flex-col gap-8 md:flex-row md:items-center md:justify-between md:gap-0">
      <app-button variant="secondary">Se connecter</app-button>
      <app-button variant="secondary">S'inscrire</app-button>
    </div>
  </main>
  `,
})
export class HomePage {}
