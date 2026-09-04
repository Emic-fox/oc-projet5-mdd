import { Component } from '@angular/core';
import { LoginForm } from "../../components/login-form/login-form";

@Component({
  imports: [LoginForm],
  selector: 'app-login-page',
  host: { class: 'flex min-h-dvh flex-col items-center justify-center' },
  template: `
  <main class="flex flex-col items-center gap-5">
    <h1>Se connecter</h1>
    <app-login-form />
  </main>`,
})
export class LoginPage {}
