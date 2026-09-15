import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { vi } from 'vitest';
import { InputSelect } from './input-select';

describe('InputSelect', () => {
  let component: InputSelect;
  let fixture: ComponentFixture<InputSelect>;

  const getSelect = (): HTMLSelectElement =>
    fixture.debugElement.query(By.css('select')).nativeElement;

  const getOptions = (): HTMLOptionElement[] =>
    Array.from(getSelect().querySelectorAll('option'));

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [InputSelect],
    }).compileComponents();

    fixture = TestBed.createComponent(InputSelect);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should use default inputs', () => {
    fixture.detectChanges();
    const select = getSelect();

    expect(component.value()).toBeNull();
    expect(component.invalid()).toBe(false);
    expect(component.touched()).toBe(false);
    expect(component.errors()).toEqual([]);
    expect(component.options()).toEqual([]);
    expect(component.placeholder()).toBe('Sélectionner une option');
    expect(select.value).toBe('');
  });

  it('should render a disabled placeholder option', () => {
    fixture.componentRef.setInput('placeholder', 'Choisissez un thème');
    fixture.detectChanges();

    const [placeholderOption] = getOptions();
    expect(placeholderOption.textContent).toBe('Choisissez un thème');
    expect(placeholderOption.disabled).toBe(true);
  });

  it('should render an option for each entry in options', () => {
    fixture.componentRef.setInput('options', [
      { value: 1, label: 'Thème 1' },
      { value: 2, label: 'Thème 2' },
    ]);
    fixture.detectChanges();

    const options = getOptions().slice(1);
    expect(options.map((o) => o.value)).toEqual(['1', '2']);
    expect(options.map((o) => o.textContent)).toEqual(['Thème 1', 'Thème 2']);
  });

  it('should reflect the value input on the native select', () => {
    fixture.componentRef.setInput('options', [{ value: 1, label: 'Thème 1' }]);
    fixture.componentRef.setInput('value', 1);
    fixture.detectChanges();

    expect(getSelect().value).toBe('1');
  });

  it('should update the value model when the user picks an option', () => {
    fixture.componentRef.setInput('options', [
      { value: 1, label: 'Thème 1' },
      { value: 2, label: 'Thème 2' },
    ]);
    fixture.detectChanges();
    const select = getSelect();

    select.value = '2';
    select.dispatchEvent(new Event('change'));
    fixture.detectChanges();

    expect(component.value()).toBe(2);
  });

  it('should emit touch when the select is blurred', () => {
    fixture.detectChanges();
    const touchSpy = vi.fn();
    component.touch.subscribe(touchSpy);

    getSelect().dispatchEvent(new Event('blur'));

    expect(touchSpy).toHaveBeenCalled();
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
