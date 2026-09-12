import { Component } from '@angular/core';

@Component({
  imports: [],
  selector: 'app-card',
  template: `<article class="bg-neutral-100 rounded-md py-2 px-4 flex flex-col gap-1 h-full">
    <h3 class="font-bold text-lg"><ng-content select="[label]" /></h3>
    <ng-content />
  </article>`,
})
export class Card {}
