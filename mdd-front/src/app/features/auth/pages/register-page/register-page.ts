import { Component } from '@angular/core';
import { RegisterForm } from "../../components/register-form/register-form";

@Component({
  imports: [RegisterForm],
  selector: 'app-register-page',
  template: `<app-register-form />`,
})
export class RegisterPage {}
