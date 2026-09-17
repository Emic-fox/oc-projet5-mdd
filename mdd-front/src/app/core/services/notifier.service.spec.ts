import { vi } from 'vitest';
import { Notifier } from './notifier.service';

describe('Notifier', () => {
  let notifier: Notifier;

  beforeEach(() => {
    vi.useFakeTimers();
    notifier = new Notifier();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('starts with no toasts', () => {
    expect(notifier.toasts()).toEqual([]);
  });

  it('stacks error and success toasts', () => {
    notifier.error('Oops');
    notifier.success('Saved');

    expect(notifier.toasts()).toEqual([
      { id: 0, type: 'error', message: 'Oops' },
      { id: 1, type: 'success', message: 'Saved' },
    ]);
  });

  it('dismisses a toast by id', () => {
    notifier.error('Oops');
    const [toast] = notifier.toasts();

    notifier.dismiss(toast.id);

    expect(notifier.toasts()).toEqual([]);
  });

  it('auto-dismisses a toast after 5s', () => {
    notifier.error('Oops');
    expect(notifier.toasts()).toHaveLength(1);

    vi.advanceTimersByTime(5000);

    expect(notifier.toasts()).toEqual([]);
  });
});
