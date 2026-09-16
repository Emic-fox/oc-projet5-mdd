import { ChangeDetectionStrategy, Component, input } from '@angular/core';

@Component({
  imports: [],
  selector: 'app-errors-container',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    @if (message()) {
      <p class="text-sm text-red-600" role="alert" data-testid="content-error">{{ message() }}</p>
    }
  `,
})
export class ErrorsContainer {
  message = input<string | null>(null);
}
