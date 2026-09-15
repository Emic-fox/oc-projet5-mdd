import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { vi } from 'vitest';
import { InputTextarea } from './input-textarea';

describe('InputTextarea', () => {
  let component: InputTextarea;
  let fixture: ComponentFixture<InputTextarea>;

  const getTextarea = (): HTMLTextAreaElement =>
    fixture.debugElement.query(By.css('textarea')).nativeElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [InputTextarea],
    }).compileComponents();

    fixture = TestBed.createComponent(InputTextarea);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should use default inputs', () => {
    fixture.detectChanges();
    const textarea = getTextarea();

    expect(component.value()).toBe('');
    expect(component.invalid()).toBe(false);
    expect(component.touched()).toBe(false);
    expect(component.errors()).toEqual([]);
    expect(component.placeholder()).toBe('');
    expect(component.rows()).toBe(8);
    expect(textarea.rows).toBe(8);
    expect(textarea.placeholder).toBe('');
  });

  it('should reflect the value input on the native textarea', () => {
    fixture.componentRef.setInput('value', 'hello');
    fixture.detectChanges();

    expect(getTextarea().value).toBe('hello');
  });

  it('should update the value model when the user types', () => {
    fixture.detectChanges();
    const textarea = getTextarea();

    textarea.value = 'typed content';
    textarea.dispatchEvent(new Event('input'));
    fixture.detectChanges();

    expect(component.value()).toBe('typed content');
  });

  it('should reflect the placeholder input', () => {
    fixture.componentRef.setInput('placeholder', 'Contenu de l\'article');
    fixture.detectChanges();

    expect(getTextarea().placeholder).toBe("Contenu de l'article");
  });

  it('should reflect the rows input', () => {
    fixture.componentRef.setInput('rows', 12);
    fixture.detectChanges();

    expect(getTextarea().rows).toBe(12);
  });

  it('should trim the value and emit touch when the textarea is blurred', () => {
    fixture.componentRef.setInput('value', '  padded content  ');
    fixture.detectChanges();
    const touchSpy = vi.fn();
    component.touch.subscribe(touchSpy);

    getTextarea().dispatchEvent(new Event('blur'));

    expect(component.value()).toBe('padded content');
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
