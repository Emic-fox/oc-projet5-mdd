import { Component, computed, input } from '@angular/core';

type LogoSize = 'small' | 'large';

const SIZE_CLASSES: Record<LogoSize, string> = {
  small: 'h-12 lg:h-20',
  large: 'h-32 lg:h-60',
};

@Component({
  imports: [],
  selector: 'app-logo',
  template: `<img [class]="sizeClass()" src="logo.svg" alt="MDD" />`,
})
export class Logo {
  size = input<LogoSize>('small');

  protected readonly sizeClass = computed(() => `${SIZE_CLASSES[this.size()]} w-auto`);
}
