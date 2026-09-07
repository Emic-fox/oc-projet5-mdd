import { Component, input, model, output } from '@angular/core';
import { FormValueControl, ValidationError, WithOptionalFieldTree } from '@angular/forms/signals';
import { FormFieldLayout } from '@shared/components/forms/form-field-layout/form-field-layout';

@Component({
  imports: [FormFieldLayout],
  selector: 'app-input-text',
  template: `
  <app-form-field-layout [invalid]="invalid()" [touched]="touched()" [errors]="errors()">
    <ng-content label></ng-content>
    <input
      [type]="type()"
      class="border rounded-md px-2 py-1"
      [value]="value()"
      (input)="value.set($event.target.value)"
      (blur)="touch.emit()"
      [placeholder]="placeholder()"
      [autocomplete]="autocomplete()"
      data-testid="input"
    />
  </app-form-field-layout>
  `,
})
export class InputText implements FormValueControl<string> {
  value = model('');
  invalid = input<boolean>(false);
  touched = input<boolean>(false);
  errors = input<readonly WithOptionalFieldTree<ValidationError>[]>([]);
  touch = output<void>();

  type = input<'text' | 'email'>('text');
  placeholder = input('Enter text');
  autocomplete = input<
    'off' | 'on' | 'name' | 'username' | 'email' | 'given-name' | 'family-name' | 'nickname' | 'organization' | 'tel' | 'url'
  >('off');
}
