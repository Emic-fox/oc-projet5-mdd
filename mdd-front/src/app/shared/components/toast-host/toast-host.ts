import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { Notifier } from '@app/core/services/notifier.service';
import { Toast } from '@app/shared/components/toast/toast';

@Component({
  selector: 'app-toast-host',
  imports: [Toast],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="fixed bottom-4 right-4 z-50 flex flex-col gap-2">
      <div aria-live="assertive">
        @for (toast of errorToasts(); track toast.id) {
          <app-toast [toast]="toast" (dismiss)="notifier.dismiss($event)" />
        }
      </div>
      <div aria-live="polite">
        @for (toast of successToasts(); track toast.id) {
          <app-toast [toast]="toast" (dismiss)="notifier.dismiss($event)" />
        }
      </div>
    </div>
  `,
})
export class ToastHost {
  protected readonly notifier = inject(Notifier);

  protected readonly errorToasts = computed(() => this.notifier.toasts().filter((t) => t.type === 'error'));
  protected readonly successToasts = computed(() => this.notifier.toasts().filter((t) => t.type === 'success'));
}
