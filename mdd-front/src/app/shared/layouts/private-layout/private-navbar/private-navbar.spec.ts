import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { provideRouter } from '@angular/router';
import { vi } from 'vitest';
import { PrivateNavbar } from './private-navbar';
import { AuthService } from '@features/auth/services/auth.service';

@Component({ template: '' })
class BlankPage {}

describe('PrivateNavbar', () => {
  let component: PrivateNavbar;
  let fixture: ComponentFixture<PrivateNavbar>;

  const getByTestId = (testId: string): HTMLElement =>
    fixture.debugElement.query(By.css(`[data-testid="${testId}"]`)).nativeElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PrivateNavbar],
      providers: [
        provideRouter([
          { path: 'articles', component: BlankPage },
          { path: 'topics', component: BlankPage },
          { path: 'profile', component: BlankPage },
        ]),
        { provide: AuthService, useValue: { logout: vi.fn() } },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(PrivateNavbar);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render the header logo in small size', () => {
    fixture.detectChanges();

    const logo = fixture.debugElement.query(By.css('header app-logo'));
    expect(logo).not.toBeNull();
    expect(logo.attributes['size']).toBe('small');
  });

  it('should hide the mobile menu by default', () => {
    fixture.detectChanges();

    expect(fixture.debugElement.query(By.css('[data-testid="mobile-menu"]'))).toBeNull();
  });

  it('should open the mobile menu when the hamburger is clicked', () => {
    fixture.detectChanges();

    getByTestId('menu-toggle').click();
    fixture.detectChanges();

    expect(fixture.debugElement.query(By.css('[data-testid="mobile-menu"]'))).not.toBeNull();
  });

  it('should close the mobile menu when the backdrop is clicked', () => {
    fixture.detectChanges();
    getByTestId('menu-toggle').click();
    fixture.detectChanges();

    getByTestId('menu-backdrop').click();
    fixture.detectChanges();

    expect(fixture.debugElement.query(By.css('[data-testid="mobile-menu"]'))).toBeNull();
  });

  it('should close the mobile menu when a link inside it is clicked', async () => {
    fixture.detectChanges();
    getByTestId('menu-toggle').click();
    fixture.detectChanges();

    fixture.debugElement
      .query(By.css('[data-testid="mobile-menu"] [data-testid="nav-topics"]'))
      .nativeElement.click();
    await fixture.whenStable();
    fixture.detectChanges();

    expect(fixture.debugElement.query(By.css('[data-testid="mobile-menu"]'))).toBeNull();
  });
});
