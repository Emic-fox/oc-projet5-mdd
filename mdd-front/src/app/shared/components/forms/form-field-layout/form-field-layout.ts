import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { ValidationError, WithOptionalFieldTree } from '@angular/forms/signals';

@Component({
  imports: [],
  selector: 'app-form-field-layout',
  changeDetection: ChangeDetectionStrategy.OnPush,
  styles: ``,
  template: `
  <div class="flex flex-col gap-1">
    <label class="flex flex-col gap-0.5">
      <ng-content select="[label]" data-testid="label"></ng-content>
      <ng-content></ng-content>
    </label>

    @if (invalid() && touched()) {
      <ul class="text-sm text-red-600" role="alert" data-testid="error-messages">
        @for (error of errors(); track error.message) {
          <li class="error">{{ error.message }}</li>
        }
      </ul>
    }
  </div>
  `,
})
export class FormFieldLayout {
  invalid = input<boolean>(false);
  touched = input<boolean>(false);
  errors = input<readonly WithOptionalFieldTree<ValidationError>[]>([]);
}
