import { Component, input, model, output } from '@angular/core';
import { FormValueControl, ValidationError, WithOptionalFieldTree } from '@angular/forms/signals';
import { FormFieldLayout } from '@shared/components/forms/form-field-layout/form-field-layout';

@Component({
  imports: [FormFieldLayout],
  selector: 'app-input-textarea',
  template: `
  <app-form-field-layout [invalid]="invalid()" [touched]="touched()" [errors]="errors()">
    <ng-content label></ng-content>
    <textarea
      class="border rounded-md px-2 py-1"
      [rows]="rows()"
      [value]="value()"
      (input)="value.set($any($event.target).value)"
      (blur)="onBlur()"
      [placeholder]="placeholder()"
      data-testid="input"
    ></textarea>
  </app-form-field-layout>
  `,
})
export class InputTextarea implements FormValueControl<string> {
  value = model('');
  invalid = input<boolean>(false);
  touched = input<boolean>(false);
  errors = input<readonly WithOptionalFieldTree<ValidationError>[]>([]);
  touch = output<void>();

  placeholder = input('');
  rows = input(8);

  onBlur(): void {
    this.value.set(this.value().trim());
    this.touch.emit();
  }
}
