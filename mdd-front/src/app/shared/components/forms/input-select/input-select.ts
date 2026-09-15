import { Component, input, model, output } from '@angular/core';
import { FormValueControl, ValidationError, WithOptionalFieldTree } from '@angular/forms/signals';
import { FormFieldLayout } from '@shared/components/forms/form-field-layout/form-field-layout';

export interface SelectOption {
  value: number;
  label: string;
}

@Component({
  imports: [FormFieldLayout],
  selector: 'app-input-select',
  template: `
  <app-form-field-layout [invalid]="invalid()" [touched]="touched()" [errors]="errors()">
    <ng-content label></ng-content>
    <select
      class="border rounded-md px-2 py-1"
      [value]="value() ?? ''"
      (change)="onChange($event)"
      (blur)="touch.emit()"
      data-testid="input"
    >
      <option value="" disabled>{{ placeholder() }}</option>
      @for (option of options(); track option.value) {
        <option [value]="option.value">{{ option.label }}</option>
      }
    </select>
  </app-form-field-layout>
  `,
})
export class InputSelect implements FormValueControl<number | null> {
  value = model<number | null>(null);
  invalid = input<boolean>(false);
  touched = input<boolean>(false);
  errors = input<readonly WithOptionalFieldTree<ValidationError>[]>([]);
  touch = output<void>();

  options = input<SelectOption[]>([]);
  placeholder = input('Sélectionner une option');

  onChange(event: Event) {
    const rawValue = (event.target as HTMLSelectElement).value;
    this.value.set(rawValue === '' ? null : Number(rawValue));
  }
}
