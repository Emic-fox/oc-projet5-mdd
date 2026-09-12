import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { Button } from './button';

describe('Button', () => {
  describe('standalone', () => {
    let component: Button;
    let fixture: ComponentFixture<Button>;

    const getButton = (): HTMLButtonElement =>
      fixture.debugElement.query(By.css('button')).nativeElement;

    beforeEach(async () => {
      await TestBed.configureTestingModule({
        imports: [Button],
      }).compileComponents();

      fixture = TestBed.createComponent(Button);
      component = fixture.componentInstance;
      await fixture.whenStable();
    });

    it('should create', () => {
      expect(component).toBeTruthy();
    });

    it('should use default inputs', () => {
      fixture.detectChanges();
      const button = getButton();

      expect(component.variant()).toBe('primary');
      expect(component.disabled()).toBe(false);
      expect(component.type()).toBe('button');
      expect(button.type).toBe('button');
      expect(button.disabled).toBe(false);
    });

    it('should apply primary variant classes by default', () => {
      fixture.detectChanges();
      const classes = getButton().className;

      expect(classes).not.toContain('w-full');
      expect(classes).toContain('bg-primary');
      expect(classes).toContain('text-white');
    });

    it('should apply extra classes passed by the caller', () => {
      fixture.componentRef.setInput('class', 'w-full');
      fixture.detectChanges();
      const classes = getButton().className;

      expect(classes).toContain('w-full');
    });

    it('should apply secondary variant classes', () => {
      fixture.componentRef.setInput('variant', 'secondary');
      fixture.detectChanges();
      const classes = getButton().className;

      expect(classes).toContain('bg-white');
      expect(classes).toContain('enabled:hover:bg-neutral-100');
      expect(classes).not.toContain('bg-primary');
    });

    it('should reflect the type input', () => {
      fixture.componentRef.setInput('type', 'submit');
      fixture.detectChanges();

      expect(getButton().type).toBe('submit');
    });

    it('should disable the native button', () => {
      fixture.componentRef.setInput('disabled', true);
      fixture.detectChanges();

      expect(getButton().disabled).toBe(true);
    });

    it('should coerce a string disabled attribute to boolean', () => {
      fixture.componentRef.setInput('disabled', '');
      fixture.detectChanges();

      expect(component.disabled()).toBe(true);
      expect(getButton().disabled).toBe(true);
    });
  });

  describe('content projection', () => {
    @Component({
      imports: [Button],
      template: `<app-button>Click me</app-button>`,
    })
    class HostComponent {}

    it('should render projected content', () => {
      const hostFixture = TestBed.createComponent(HostComponent);
      hostFixture.detectChanges();

      const button: HTMLButtonElement = hostFixture.debugElement.query(
        By.css('button'),
      ).nativeElement;
      expect(button.textContent?.trim()).toBe('Click me');
    });
  });
});
