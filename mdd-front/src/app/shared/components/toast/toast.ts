import { ChangeDetectionStrategy, Component, computed, input, output } from '@angular/core';
import { Toast as ToastModel } from '@app/core/services/notifier.service';

@Component({
  selector: 'app-toast',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div data-testid="toast" class="flex items-center gap-3 rounded-md px-4 py-2 shadow-md text-white mb-2" [class]="colorClass()">
      <span>{{ toast().message }}</span>
      <button type="button" class="cursor-pointer opacity-80 hover:opacity-100" (click)="dismiss.emit(toast().id)">&times;</button>
    </div>
  `,
})
export class Toast {
  toast = input.required<ToastModel>();
  dismiss = output<number>();

  protected readonly colorClass = computed(() => (this.toast().type === 'error' ? 'bg-red-600' : 'bg-green-600'));
}
