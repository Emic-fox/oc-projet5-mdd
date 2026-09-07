import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { Router, provideRouter } from '@angular/router';
import { PublicLayout } from './public-layout';

@Component({ template: '' })
class DummyPage {}

describe('PublicLayout', () => {
  let component: PublicLayout;
  let fixture: ComponentFixture<PublicLayout>;
  let router: Router;

  const getTitle = (): string =>
    fixture.debugElement.query(By.css('h1')).nativeElement.textContent.trim();

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PublicLayout],
      providers: [
        provideRouter([
          { path: 'with-title', component: DummyPage, title: 'Connexion' },
          {
            path: 'nested',
            component: DummyPage,
            children: [
              { path: 'child', component: DummyPage, title: 'Titre enfant' },
            ],
          },
          { path: 'no-title', component: DummyPage },
        ]),
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(PublicLayout);
    component = fixture.componentInstance;
    router = TestBed.inject(Router);
    await fixture.whenStable();
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render the header logo, the back link and the router outlet', () => {
    expect(fixture.debugElement.query(By.css('header app-logo'))).not.toBeNull();

    const backLink = fixture.debugElement.query(By.css('app-back-link'));
    expect(backLink).not.toBeNull();
    expect(backLink.componentInstance.to()).toEqual(['/']);
    expect(backLink.componentInstance.label()).toBe("Retour à l'accueil");

    expect(fixture.debugElement.query(By.css('router-outlet'))).not.toBeNull();
  });

  it('should start with an empty title', () => {
    expect(getTitle()).toBe('');
  });

  it("should display the current route's title data after navigation", async () => {
    await router.navigate(['/with-title']);
    fixture.detectChanges();

    expect(getTitle()).toBe('Connexion');
  });

  it('should use the deepest activated child title', async () => {
    await router.navigate(['/nested/child']);
    fixture.detectChanges();

    expect(getTitle()).toBe('Titre enfant');
  });

  it('should fall back to an empty title when the route has no title data', async () => {
    await router.navigate(['/with-title']);
    fixture.detectChanges();
    await router.navigate(['/no-title']);
    fixture.detectChanges();

    expect(getTitle()).toBe('');
  });
});
