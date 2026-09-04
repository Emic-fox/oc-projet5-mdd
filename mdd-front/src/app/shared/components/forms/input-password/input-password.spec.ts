import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { vi } from 'vitest';
import { InputPassword } from './input-password';

describe('InputPassword', () => {
  let component: InputPassword;
  let fixture: ComponentFixture<InputPassword>;

  const getInput = (): HTMLInputElement =>
    fixture.debugElement.query(By.css('input')).nativeElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [InputPassword],
    }).compileComponents();

    fixture = TestBed.createComponent(InputPassword);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should use default inputs', () => {
    fixture.detectChanges();
    const input = getInput();

    expect(component.value()).toBe('');
    expect(component.invalid()).toBe(false);
    expect(component.touched()).toBe(false);
    expect(component.errors()).toEqual([]);
    expect(component.type()).toBe('password');
    expect(component.placeholder()).toBe('**********');
    expect(component.autocomplete()).toBe('current-password');
    expect(input.type).toBe('password');
    expect(input.placeholder).toBe('**********');
    expect(input.autocomplete).toBe('current-password');
  });

  it('should reflect an allowed autocomplete value', () => {
    fixture.componentRef.setInput('autocomplete', 'new-password');
    fixture.detectChanges();

    expect(getInput().autocomplete).toBe('new-password');
  });

  it('should reflect the placeholder input', () => {
    fixture.componentRef.setInput('placeholder', 'Your password');
    fixture.detectChanges();

    expect(getInput().placeholder).toBe('Your password');
  });

  it('should reflect the value input on the native input', () => {
    fixture.componentRef.setInput('value', 'secret');
    fixture.detectChanges();

    expect(getInput().value).toBe('secret');
  });

  it('should update the value model when the user types', () => {
    fixture.detectChanges();
    const input = getInput();

    input.value = 'typed secret';
    input.dispatchEvent(new Event('input'));
    fixture.detectChanges();

    expect(component.value()).toBe('typed secret');
  });

  it('should emit touch when the input is blurred', () => {
    fixture.detectChanges();
    const touchSpy = vi.fn();
    component.touch.subscribe(touchSpy);

    getInput().dispatchEvent(new Event('blur'));

    expect(touchSpy).toHaveBeenCalled();
  });

  it('should display the default "Password" label when none is projected', () => {
    fixture.detectChanges();

    const label = fixture.debugElement.query(By.css('label'));
    expect(label.nativeElement.textContent).toContain('Mot de passe');
  });

  it('should mark the field invalid and display errors when touched', () => {
    fixture.componentRef.setInput('invalid', true);
    fixture.componentRef.setInput('touched', true);
    fixture.componentRef.setInput('errors', [{ kind: 'minLength', message: 'Too short' }]);
    fixture.detectChanges();

    const alert = fixture.debugElement.query(By.css('[role="alert"]'));
    expect(alert.nativeElement.textContent).toContain('Too short');
  });
});
