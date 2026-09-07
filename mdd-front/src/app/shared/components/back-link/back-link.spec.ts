import { Location } from '@angular/common';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { vi } from 'vitest';
import { BackLink } from './back-link';

describe('BackLink', () => {
  let component: BackLink;
  let fixture: ComponentFixture<BackLink>;
  const location = { back: vi.fn() };
  const router = { navigate: vi.fn() };

  const getButton = (): HTMLButtonElement =>
    fixture.debugElement.query(By.css('button')).nativeElement;

  beforeEach(async () => {
    location.back.mockReset();
    router.navigate.mockReset();

    await TestBed.configureTestingModule({
      imports: [BackLink],
      providers: [
        { provide: Location, useValue: location },
        { provide: Router, useValue: router },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(BackLink);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render the arrow-left icon', () => {
    fixture.detectChanges();
    const img: HTMLImageElement = fixture.debugElement.query(By.css('img')).nativeElement;

    expect(img.getAttribute('src')).toBe('assets/icons/arrow-left.svg');
  });

  it('should navigate to the previous page by default', () => {
    fixture.detectChanges();
    getButton().click();

    expect(location.back).toHaveBeenCalledTimes(1);
    expect(router.navigate).not.toHaveBeenCalled();
  });

  it('should navigate to a forced string route when provided', () => {
    fixture.componentRef.setInput('to', '/login');
    fixture.detectChanges();
    getButton().click();

    expect(router.navigate).toHaveBeenCalledWith(['/login']);
    expect(location.back).not.toHaveBeenCalled();
  });

  it('should navigate to a forced route array when provided', () => {
    fixture.componentRef.setInput('to', ['/articles', 1]);
    fixture.detectChanges();
    getButton().click();

    expect(router.navigate).toHaveBeenCalledWith(['/articles', 1]);
  });

  it('should expose a customizable aria-label', () => {
    fixture.componentRef.setInput('label', 'Revenir en arrière');
    fixture.detectChanges();

    expect(getButton().getAttribute('aria-label')).toBe('Revenir en arrière');
  });
});
