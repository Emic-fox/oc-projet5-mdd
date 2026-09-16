import { Service, signal } from '@angular/core';

const AUTO_DISMISS_MS = 5000;

export interface Toast {
  id: number;
  type: 'error' | 'success';
  message: string;
}

@Service()
export class Notifier {
  private readonly _toasts = signal<Toast[]>([]);
  readonly toasts = this._toasts.asReadonly();

  private nextId = 0;

  error(message: string): void {
    this.push('error', message);
  }

  success(message: string): void {
    this.push('success', message);
  }

  dismiss(id: number): void {
    this._toasts.update((toasts) => toasts.filter((toast) => toast.id !== id));
  }

  private push(type: Toast['type'], message: string): void {
    const id = this.nextId++;
    this._toasts.update((toasts) => [...toasts, { id, type, message }]);
    setTimeout(() => this.dismiss(id), AUTO_DISMISS_MS);
  }
}
