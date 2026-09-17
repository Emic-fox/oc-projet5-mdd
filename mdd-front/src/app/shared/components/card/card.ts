import { Component, computed, input } from '@angular/core';

@Component({
  imports: [],
  selector: 'app-card',
  template: `<article [class]="classes()">
    <h3 class="font-bold text-lg"><ng-content select="[label]" /></h3>
    <ng-content />
  </article>`,
})
export class Card {
  clickable = input(false);

  protected readonly classes = computed(() => {
    const base = 'bg-neutral-100 rounded-md py-2 px-4 flex flex-col gap-1 h-full';
    return this.clickable() ? `${base} cursor-pointer transition-colors hover:bg-neutral-200` : base;
  });
}
