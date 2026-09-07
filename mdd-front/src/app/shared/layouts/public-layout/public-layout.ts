import { Component, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { ActivatedRoute, NavigationEnd, Router, RouterOutlet } from "@angular/router";
import { filter, map } from 'rxjs';
import { Logo } from "@shared/components/logo/logo";
import { BackLink } from "@shared/components/back-link/back-link";

@Component({
  imports: [RouterOutlet, Logo, BackLink],
  selector: 'app-public-layout',
  template: `
  <div class="h-dvh flex flex-col justify-between">
    <header class="max-lg:hidden border-b border-gray-200 bg-white px-4">
      <app-logo size="small" />
    </header>
    <main class="px-8 py-6 grow">
      <app-back-link [to]="['/']" label="Retour à l'accueil" />
      <div class="flex flex-col items-center justify-center gap-2">
        <app-logo class="lg:hidden" size="large" />
        <h1 class="text-2xl">{{ title() }}</h1>
        <router-outlet />
      </div>
    </main>
    <footer></footer>
  </div>`,
})
export class PublicLayout {
  private router = inject(Router);
  private route = inject(ActivatedRoute);

  protected title = toSignal(
    this.router.events.pipe(
      filter(e => e instanceof NavigationEnd),
      map(() => this.getDeepestChild(this.route).snapshot.title ?? '')
    ),
    { initialValue: '' }
  );

  private getDeepestChild(r: ActivatedRoute) {
    while (r.firstChild) r = r.firstChild;
    return r;
  }
}
