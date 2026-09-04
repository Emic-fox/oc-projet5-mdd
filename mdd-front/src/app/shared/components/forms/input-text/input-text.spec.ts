import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { vi } from 'vitest';
import { InputText } from './input-text';

describe('InputText', () => {
  let component: InputText;
  let fixture: ComponentFixture<InputText>;

  const getInput = (): HTMLInputElement =>
    fixture.debugElement.query(By.css('input')).nativeElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [InputText],
    }).compileComponents();

    fixture = TestBed.createComponent(InputText);
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
    expect(component.type()).toBe('text');
    expect(component.placeholder()).toBe('Enter text');
    expect(component.autocomplete()).toBe('off');
    expect(input.type).toBe('text');
    expect(input.placeholder).toBe('Enter text');
    expect(input.autocomplete).toBe('off');
  });

  it('should reflect the value input on the native input', () => {
    fixture.componentRef.setInput('value', 'hello');
    fixture.detectChanges();

    expect(getInput().value).toBe('hello');
  });

  it('should update the value model when the user types', () => {
    fixture.detectChanges();
    const input = getInput();

    input.value = 'typed value';
    input.dispatchEvent(new Event('input'));
    fixture.detectChanges();

    expect(component.value()).toBe('typed value');
  });

  it('should emit touch when the input is blurred', () => {
    fixture.detectChanges();
    const touchSpy = vi.fn();
    component.touch.subscribe(touchSpy);

    getInput().dispatchEvent(new Event('blur'));

    expect(touchSpy).toHaveBeenCalled();
  });

  it('should reflect the type input', () => {
    fixture.componentRef.setInput('type', 'email');
    fixture.detectChanges();

    expect(getInput().type).toBe('email');
  });

  it('should reflect the placeholder input', () => {
    fixture.componentRef.setInput('placeholder', 'Your name');
    fixture.detectChanges();

    expect(getInput().placeholder).toBe('Your name');
  });

  it('should reflect an allowed autocomplete value', () => {
    fixture.componentRef.setInput('autocomplete', 'email');
    fixture.detectChanges();

    expect(getInput().autocomplete).toBe('email');
  });

  it('should mark the field invalid and display errors when touched', () => {
    fixture.componentRef.setInput('invalid', true);
    fixture.componentRef.setInput('touched', true);
    fixture.componentRef.setInput('errors', [{ kind: 'required', message: 'Required field' }]);
    fixture.detectChanges();

    const alert = fixture.debugElement.query(By.css('[role="alert"]'));
    expect(alert.nativeElement.textContent).toContain('Required field');
  });
});
