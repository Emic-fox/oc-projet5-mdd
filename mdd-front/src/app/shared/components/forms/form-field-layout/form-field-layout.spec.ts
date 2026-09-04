import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { FormFieldLayout } from './form-field-layout';

describe('FormFieldLayout', () => {
  describe('standalone', () => {
    let component: FormFieldLayout;
    let fixture: ComponentFixture<FormFieldLayout>;

    const getAlert = (): HTMLElement | null =>
      fixture.debugElement.query(By.css('[role="alert"]'))?.nativeElement ?? null;

    beforeEach(async () => {
      await TestBed.configureTestingModule({
        imports: [FormFieldLayout],
      }).compileComponents();

      fixture = TestBed.createComponent(FormFieldLayout);
      component = fixture.componentInstance;
      await fixture.whenStable();
    });

    it('should create', () => {
      expect(component).toBeTruthy();
    });

    it('should use default inputs', () => {
      fixture.detectChanges();

      expect(component.invalid()).toBe(false);
      expect(component.touched()).toBe(false);
      expect(component.errors()).toEqual([]);
    });

    it('should not display an alert when not invalid', () => {
      fixture.componentRef.setInput('invalid', false);
      fixture.componentRef.setInput('touched', true);
      fixture.detectChanges();

      expect(getAlert()).toBeNull();
    });

    it('should not display an alert when invalid but not touched', () => {
      fixture.componentRef.setInput('invalid', true);
      fixture.componentRef.setInput('touched', false);
      fixture.detectChanges();

      expect(getAlert()).toBeNull();
    });

    it('should display an alert when invalid and touched', () => {
      fixture.componentRef.setInput('invalid', true);
      fixture.componentRef.setInput('touched', true);
      fixture.detectChanges();

      expect(getAlert()).not.toBeNull();
    });

    it('should render each error message', () => {
      fixture.componentRef.setInput('invalid', true);
      fixture.componentRef.setInput('touched', true);
      fixture.componentRef.setInput('errors', [
        { kind: 'required', message: 'Field is required' },
        { kind: 'minLength', message: 'Too short' },
      ]);
      fixture.detectChanges();

      const messages = fixture.debugElement
        .queryAll(By.css('[role="alert"] .error'))
        .map((el) => el.nativeElement.textContent.trim());

      expect(messages).toEqual(['Field is required', 'Too short']);
    });
  });

  describe('content projection', () => {
    @Component({
      imports: [FormFieldLayout],
      template: `
        <app-form-field-layout>
          <span label>My label</span>
          <input type="text" />
        </app-form-field-layout>
      `,
    })
    class HostComponent {}

    it('should render the label and default content', () => {
      const hostFixture = TestBed.createComponent(HostComponent);
      hostFixture.detectChanges();

      const label = hostFixture.debugElement.query(By.css('label'));
      expect(label.nativeElement.textContent).toContain('My label');
      expect(hostFixture.debugElement.query(By.css('input'))).not.toBeNull();
    });
  });
});
