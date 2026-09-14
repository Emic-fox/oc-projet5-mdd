import { ChangeDetectionStrategy, Component, computed, model } from '@angular/core';

@Component({
  imports: [],
  selector: 'app-sort-by',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <button
      type="button"
      class="cursor-pointer text-lg font-bold"
      (click)="toggle()"
      [attr.aria-label]="ariaLabel()"
      data-testid="sort-by"
    >
      Trier par <span aria-hidden="true">{{ arrow() }}</span>
    </button>
  `,
})
export class SortBy {
  order = model<'asc' | 'desc'>('asc');

  arrow = computed(() => (this.order() === 'asc' ? '↑' : '↓'));
  ariaLabel = computed(() =>
    this.order() === 'asc'
      ? 'Trier par ordre croissant, cliquer pour trier par ordre décroissant'
      : 'Trier par ordre décroissant, cliquer pour trier par ordre croissant',
  );

  toggle() {
    this.order.set(this.order() === 'asc' ? 'desc' : 'asc');
  }
}
