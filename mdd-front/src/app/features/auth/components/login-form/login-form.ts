import { Component, output, signal } from '@angular/core';
import { form, FormField, required, email, submit } from '@angular/forms/signals';
import { Button } from "@shared/components/button/button";
import { InputText } from "@shared/components/forms/input-text/input-text";
import { InputPassword } from "@shared/components/forms/input-password/input-password";

export interface LoginData {
  login: string;
  password: string;
}

@Component({
  imports: [Button, FormField, InputText, InputPassword],
  selector: 'app-login-form',
  styles: ``,
  template: `
  <form class="flex flex-col items-center gap-4 w-full max-w-sm" (submit)="onSubmit($event)">
    <app-input-text [formField]="loginForm.login" placeholder="JohnDoe" autocomplete="username" data-testid="login">Email ou nom d'utilisateur</app-input-text>

    <app-input-password [formField]="loginForm.password" autocomplete="current-password" data-testid="password" />

    <app-button type="submit" data-testid="login-submit" [disabled]="loginForm().invalid()">Se connecter</app-button>
  </form>`,
})
export class LoginForm {
  submitted = output<LoginData>();

  loginModel = signal<LoginData>({
    login: '',
    password: ''
  });

  loginForm = form(this.loginModel, (fieldPath) => {
    required(fieldPath.login, { message: "L'identifiant est obligatoire" });
    required(fieldPath.password, { message: "Le mot de passe est obligatoire" });
  });

  onSubmit(event: Event) {
    event.preventDefault();
    submit(this.loginForm, async () => {
      this.submitted.emit(this.loginModel());
    });
  }
}
