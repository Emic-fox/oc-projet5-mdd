import { TestBed } from '@angular/core/testing';
import { Notifier } from '@app/core/services/notifier.service';
import { ToastHost } from './toast-host';

describe('ToastHost', () => {
  let notifier: Notifier;

  beforeEach(() => {
    TestBed.configureTestingModule({ imports: [ToastHost] });
    notifier = TestBed.inject(Notifier);
  });

  it('renders nothing when there are no toasts', () => {
    const fixture = TestBed.createComponent(ToastHost);
    fixture.detectChanges();

    const toasts = fixture.nativeElement.querySelectorAll('[data-testid="toast"]');
    expect(toasts.length).toBe(0);
  });

  it('renders a toast for each notifier entry', () => {
    const fixture = TestBed.createComponent(ToastHost);
    fixture.detectChanges();

    notifier.error('Oops');
    notifier.success('Saved');
    fixture.detectChanges();

    const toasts = fixture.nativeElement.querySelectorAll('[data-testid="toast"]');
    expect(toasts.length).toBe(2);
    expect(fixture.nativeElement.textContent).toContain('Oops');
    expect(fixture.nativeElement.textContent).toContain('Saved');
  });

  it('dismisses a toast when its close button is clicked', () => {
    const fixture = TestBed.createComponent(ToastHost);
    notifier.error('Oops');
    fixture.detectChanges();

    fixture.nativeElement.querySelector('[data-testid="toast"] button').click();
    fixture.detectChanges();

    expect(fixture.nativeElement.querySelectorAll('[data-testid="toast"]').length).toBe(0);
  });

  it('keeps the live-region containers in the DOM even without toasts', () => {
    const fixture = TestBed.createComponent(ToastHost);
    fixture.detectChanges();

    expect(fixture.nativeElement.querySelector('[aria-live="assertive"]')).not.toBeNull();
    expect(fixture.nativeElement.querySelector('[aria-live="polite"]')).not.toBeNull();
  });
});
