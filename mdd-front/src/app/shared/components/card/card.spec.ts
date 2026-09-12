import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { Card } from './card';

describe('Card', () => {
  let component: Card;
  let fixture: ComponentFixture<Card>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Card],
    }).compileComponents();

    fixture = TestBed.createComponent(Card);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('content projection', () => {
    @Component({
      imports: [Card],
      template: `<app-card><span label>Titre</span><p>Corps</p></app-card>`,
    })
    class HostComponent {}

    it('should project the label content into the title', () => {
      const hostFixture = TestBed.createComponent(HostComponent);
      hostFixture.detectChanges();

      const title: HTMLElement = hostFixture.debugElement.query(By.css('h3')).nativeElement;
      expect(title.textContent?.trim()).toBe('Titre');
    });

    it('should project the remaining content into the body', () => {
      const hostFixture = TestBed.createComponent(HostComponent);
      hostFixture.detectChanges();

      const body: HTMLElement = hostFixture.debugElement.query(By.css('article')).nativeElement;
      expect(body.querySelector('p')?.textContent?.trim()).toBe('Corps');
    });
  });
});
