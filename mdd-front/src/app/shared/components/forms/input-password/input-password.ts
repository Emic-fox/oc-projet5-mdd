import { Component, computed, input, model, output } from '@angular/core';
import { FormValueControl, ValidationError, WithOptionalFieldTree } from '@angular/forms/signals';
import { FormFieldLayout } from '@shared/components/forms/form-field-layout/form-field-layout';

@Component({
  imports: [FormFieldLayout],
  selector: 'app-input-password',
  template: `
  <app-form-field-layout [invalid]="invalid()" [touched]="touched()" [errors]="errors()">
    <ng-content label>Mot de passe</ng-content>
    <input
      [type]="type()"
      class="border rounded-md px-2 py-1"
      [value]="value()"
      (input)="value.set($event.target.value)"
      (blur)="touch.emit()"
      [placeholder]="placeholder()"
      [autocomplete]="autocomplete()"
    />
  </app-form-field-layout>
  `,
})
export class InputPassword implements FormValueControl<string> {
  value = model('');
  invalid = input<boolean>(false);
  touched = input<boolean>(false);
  errors = input<readonly WithOptionalFieldTree<ValidationError>[]>([]);
  touch = output<void>();

  placeholder = input('**********');
  autocomplete = input<'current-password' | 'new-password' | 'off'>('current-password');

  type = computed<'password' | 'text'>(() => 'password');
}
