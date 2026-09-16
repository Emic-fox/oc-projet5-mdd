import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  imports: [RouterLink],
  selector: 'app-not-found-page',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'flex min-h-dvh flex-col items-center justify-center gap-4 text-center' },
  template: `
    <h1 class="text-2xl font-bold" data-testid="not-found-title">Page introuvable</h1>
    <p>La page que vous recherchez n'existe pas ou n'est plus disponible.</p>
    <a routerLink="/" class="text-primary underline" data-testid="not-found-home-link">Retour à l'accueil</a>
  `,
})
export class NotFoundPage {}
