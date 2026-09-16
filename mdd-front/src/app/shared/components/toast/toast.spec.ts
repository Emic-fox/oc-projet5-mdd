import { TestBed } from '@angular/core/testing';
import { Toast } from './toast';

describe('Toast', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({ imports: [Toast] });
  });

  it('renders the message', () => {
    const fixture = TestBed.createComponent(Toast);
    fixture.componentRef.setInput('toast', { id: 1, type: 'success', message: 'Saved' });
    fixture.detectChanges();

    expect(fixture.nativeElement.textContent).toContain('Saved');
  });

  it('applies the error color for an error toast', () => {
    const fixture = TestBed.createComponent(Toast);
    fixture.componentRef.setInput('toast', { id: 1, type: 'error', message: 'Oops' });
    fixture.detectChanges();

    const el = fixture.nativeElement.querySelector('[data-testid="toast"]');
    expect(el.className).toContain('bg-red-600');
  });

  it('applies the success color for a success toast', () => {
    const fixture = TestBed.createComponent(Toast);
    fixture.componentRef.setInput('toast', { id: 1, type: 'success', message: 'Saved' });
    fixture.detectChanges();

    const el = fixture.nativeElement.querySelector('[data-testid="toast"]');
    expect(el.className).toContain('bg-green-600');
  });

  it('emits dismiss with the toast id when the close button is clicked', () => {
    const fixture = TestBed.createComponent(Toast);
    fixture.componentRef.setInput('toast', { id: 42, type: 'success', message: 'Saved' });
    fixture.detectChanges();

    const emitted: number[] = [];
    fixture.componentInstance.dismiss.subscribe((id: number) => emitted.push(id));
    fixture.nativeElement.querySelector('button').click();

    expect(emitted).toEqual([42]);
  });
});
