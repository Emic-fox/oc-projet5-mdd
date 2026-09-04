import { booleanAttribute, ChangeDetectionStrategy, Component, computed, input } from '@angular/core';

@Component({
  imports: [],
  selector: 'app-button',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `<button [type]="type()" [class]="classes()" [disabled]="disabled()"><ng-content/></button>`,
})
export class Button {
  variant = input<'primary' | 'secondary'>('primary');
  disabled = input<boolean>(false, { transform: booleanAttribute});
  type = input<'button' | 'submit'>('button');
  class = input<string>('');

  classes = computed(() => {
    const baseClasses = 'cursor-pointer rounded-md border px-4 py-1 disabled:opacity-50 disabled:cursor-not-allowed';
    const variantClasses =
      this.variant() === 'primary'
        ? 'bg-primary text-white enabled:hover:opacity-90'
        : 'bg-white enabled:hover:bg-gray-100';

    return `${baseClasses} ${variantClasses} ${this.class()}`;
  });
}
