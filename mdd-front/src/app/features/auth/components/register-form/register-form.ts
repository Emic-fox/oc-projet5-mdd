import { Component, output, signal } from '@angular/core';
import { form, FormField, required, email, minLength, pattern, submit } from '@angular/forms/signals';
import { Button } from "@shared/components/button/button";
import { InputText } from "@shared/components/forms/input-text/input-text";
import { InputPassword } from "@shared/components/forms/input-password/input-password";

export interface RegisterData {
  username: string;
  email: string;
  password: string;
}

@Component({
  imports: [Button, FormField, InputText, InputPassword],
  selector: 'app-register-form',
  styles: ``,
  template: `
  <form class="flex flex-col items-center gap-4 w-full max-w-sm" (submit)="onSubmit($event)">
    <app-input-text [formField]="registerForm.username" placeholder="john.doe" autocomplete="username">Nom d'utilisateur</app-input-text>

    <app-input-text [formField]="registerForm.email" type="email" placeholder="john.doe@example.com" autocomplete="email">Adresse e-mail</app-input-text>

    <app-input-password [formField]="registerForm.password" autocomplete="new-password" />

    <app-button type="submit" [disabled]="registerForm().invalid()">S'inscrire</app-button>
  </form>`,
})
export class RegisterForm {
  submitted = output<RegisterData>();

  registerModel = signal<RegisterData>({
    username: '',
    email: '',
    password: ''
  });

  registerForm = form(this.registerModel, (fieldPath) => {
    required(fieldPath.username, { message: "Le nom d'utilisateur est obligatoire" });

    required(fieldPath.email, { message: "L'adresse e-mail est obligatoire" });
    email(fieldPath.email, { message: "L'adresse e-mail doit être valide" });

    required(fieldPath.password, { message: 'Le mot de passe est obligatoire' });
    minLength(fieldPath.password, 8, { message: 'Le mot de passe doit contenir au moins 8 caractères' });
    pattern(fieldPath.password, /[0-9]/, { message: 'Le mot de passe doit contenir au moins 1 chiffre' });
    pattern(fieldPath.password, /[a-z]/, { message: 'Le mot de passe doit contenir au moins 1 minuscule' });
    pattern(fieldPath.password, /[A-Z]/, { message: 'Le mot de passe doit contenir au moins 1 majuscule' });
    pattern(fieldPath.password, /[^A-Za-z0-9]/, { message: 'Le mot de passe doit contenir au moins 1 caractère spécial' });
  });

  onSubmit(event: Event) {
    event.preventDefault();
    submit(this.registerForm, async () => {
      this.submitted.emit(this.registerModel());
    });
  }
}
