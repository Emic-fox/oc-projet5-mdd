import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { provideRouter, Router } from '@angular/router';
import { vi } from 'vitest';
import { PrivateNavLinks } from './private-nav-links';
import { AuthService } from '@features/auth/services/auth.service';

@Component({ template: '' })
class BlankPage {}

describe('PrivateNavLinks', () => {
  let component: PrivateNavLinks;
  let fixture: ComponentFixture<PrivateNavLinks>;
  const auth = { logout: vi.fn() };

  const getByTestId = (testId: string): HTMLElement =>
    fixture.debugElement.query(By.css(`[data-testid="${testId}"]`)).nativeElement;

  beforeEach(async () => {
    auth.logout.mockReset();

    await TestBed.configureTestingModule({
      imports: [PrivateNavLinks],
      providers: [
        provideRouter([
          { path: 'articles', component: BlankPage },
          { path: 'topics', component: BlankPage },
        ]),
        { provide: AuthService, useValue: auth },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(PrivateNavLinks);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render the logout button and the Articles/Thèmes links', () => {
    fixture.detectChanges();

    expect(getByTestId('logout').textContent?.trim()).toBe('Se déconnecter');
    expect(getByTestId('nav-articles').textContent?.trim()).toBe('Articles');
    expect(getByTestId('nav-topics').textContent?.trim()).toBe('Thèmes');
  });

  it('should log out, navigate home and emit linkClicked when the logout button is clicked', () => {
    const router = TestBed.inject(Router);
    const navigateSpy = vi.spyOn(router, 'navigate');
    fixture.detectChanges();
    const linkClickedSpy = vi.fn();
    component.navigate.subscribe(linkClickedSpy);

    getByTestId('logout').click();

    expect(auth.logout).toHaveBeenCalledTimes(1);
    expect(navigateSpy).toHaveBeenCalledWith(['']);
    expect(linkClickedSpy).toHaveBeenCalledTimes(1);
  });

  it('should emit linkClicked when a nav link is clicked', async () => {
    fixture.detectChanges();
    const linkClickedSpy = vi.fn();
    component.navigate.subscribe(linkClickedSpy);

    getByTestId('nav-articles').click();
    await fixture.whenStable();

    expect(linkClickedSpy).toHaveBeenCalledTimes(1);
  });
});
