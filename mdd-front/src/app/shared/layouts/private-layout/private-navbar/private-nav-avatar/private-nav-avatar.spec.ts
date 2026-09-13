import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { provideRouter } from '@angular/router';
import { vi } from 'vitest';
import { PrivateNavAvatar } from './private-nav-avatar';

@Component({ template: '' })
class BlankPage {}

describe('PrivateNavAvatar', () => {
  let component: PrivateNavAvatar;
  let fixture: ComponentFixture<PrivateNavAvatar>;

  const getLink = (): HTMLAnchorElement =>
    fixture.debugElement.query(By.css('[data-testid="nav-profile"]')).nativeElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PrivateNavAvatar],
      providers: [provideRouter([{ path: 'profile', component: BlankPage }])],
    }).compileComponents();

    fixture = TestBed.createComponent(PrivateNavAvatar);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render the avatar icon inside a link to the profile', () => {
    fixture.detectChanges();

    const img: HTMLImageElement = fixture.debugElement.query(By.css('img')).nativeElement;
    expect(img.getAttribute('src')).toBe('assets/icons/user.svg');
  });

  it('should emit navigate when clicked', async () => {
    fixture.detectChanges();
    const navigateSpy = vi.fn();
    component.navigate.subscribe(navigateSpy);

    getLink().click();
    await fixture.whenStable();

    expect(navigateSpy).toHaveBeenCalledTimes(1);
  });
});
