import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { ToastHost } from '@app/shared/components/toast-host/toast-host';

@Component({
  imports: [RouterOutlet, ToastHost],
  selector: 'app-root',
  templateUrl: './app.html',
})
export class App {
  protected readonly title = signal('mdd-front');
}
