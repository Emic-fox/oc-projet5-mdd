import { Component } from '@angular/core';
import { Logo } from '../../components/logo/logo';
import { RouterOutlet } from '@angular/router';

@Component({
  imports: [Logo, RouterOutlet],
  selector: 'app-private-layout',
  styles: ``,
  template: `<div class="h-dvh flex flex-col justify-between">
    <header class="border-b border-gray-200 bg-white px-4">
      <app-logo size="small" />
    </header>
    <main class="p-4 grow">
      <router-outlet />
    </main>
    <footer></footer>
  </div>`,
})
export class PrivateLayout {}
