import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { PrivateNavbar } from './private-navbar/private-navbar';

@Component({
  imports: [RouterOutlet, PrivateNavbar],
  selector: 'app-private-layout',
  styles: ``,
  template: `<div class="h-dvh flex flex-col justify-between">
    <app-private-navbar />
    <main class="p-4 grow">
      <router-outlet />
    </main>
    <footer></footer>
  </div>`,
})
export class PrivateLayout {}
