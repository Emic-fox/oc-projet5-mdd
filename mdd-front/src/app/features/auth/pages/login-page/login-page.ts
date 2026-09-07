import { Component } from '@angular/core';
import { LoginForm } from "../../components/login-form/login-form";

@Component({
  imports: [LoginForm],
  selector: 'app-login-page',
  template: `<app-login-form />`,
})
export class LoginPage {}
