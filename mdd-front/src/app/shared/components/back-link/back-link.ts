import { Location } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject, input } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  imports: [],
  selector: 'app-back-link',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <button type="button" class="cursor-pointer" data-testid="back-link" [attr.aria-label]="label()" (click)="goBack()">
      <img src="assets/icons/arrow-left.svg" [alt]="label()" class="h-6 w-auto" />
    </button>
  `,
})
export class BackLink {
  /** Destination forcée. Si vide, navigue vers la page précédente. */
  to = input<string | unknown[]>();
  label = input<string>('Retour');

  private location = inject(Location);
  private router = inject(Router);

  protected goBack(): void {
    const to = this.to();

    if (to == null) {
      this.location.back();
      return;
    }

    this.router.navigate(Array.isArray(to) ? to : [to]);
  }
}
