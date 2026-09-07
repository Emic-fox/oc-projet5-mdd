import { ComponentFixture, TestBed } from '@angular/core/testing';
import { signal } from '@angular/core';
import { By } from '@angular/platform-browser';
import { Router, provideRouter } from '@angular/router';
import { HomePage } from './home-page';
import { AuthService } from '@features/auth/services/auth.service';
import { MeResponse } from '@features/auth/models/me-response.interface';

describe('HomePage', () => {
  let component: HomePage;
  let fixture: ComponentFixture<HomePage>;
  let router: Router;
  let user: ReturnType<typeof signal<MeResponse | null>>;
  let logout: ReturnType<typeof vi.fn>;

  const render = async () => {
    fixture = TestBed.createComponent(HomePage);
    component = fixture.componentInstance;
    await fixture.whenStable();
    fixture.detectChanges();
  };

  beforeEach(async () => {
    user = signal<MeResponse | null>(null);
    logout = vi.fn(() => user.set(null));

    await TestBed.configureTestingModule({
      imports: [HomePage],
      providers: [
        provideRouter([]),
        { provide: AuthService, useValue: { user, logout } },
      ],
    }).compileComponents();

    router = TestBed.inject(Router);
    vi.spyOn(router, 'navigate').mockResolvedValue(true);
    await render();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render the large logo', () => {
    const logo = fixture.debugElement.query(By.css('app-logo'));

    expect(logo).not.toBeNull();
    expect(logo.attributes['size']).toBe('large');
    expect(logo.query(By.css('img')).nativeElement.className).toContain('h-32');
  });

  describe('when logged out', () => {
    it('should render the login and register buttons', () => {
      const labels = fixture.debugElement
        .queryAll(By.css('app-button'))
        .map((button) => button.nativeElement.textContent.trim());

      expect(labels).toEqual(['Se connecter', "S'inscrire"]);
    });

    it('should navigate to /login when clicking the login button', () => {
      const [loginButton] = fixture.debugElement.queryAll(By.css('app-button button'));

      loginButton.nativeElement.click();

      expect(router.navigate).toHaveBeenCalledWith(['/login']);
    });

    it('should navigate to /register when clicking the register button', () => {
      const [, registerButton] = fixture.debugElement.queryAll(By.css('app-button button'));

      registerButton.nativeElement.click();

      expect(router.navigate).toHaveBeenCalledWith(['/register']);
    });

    it('should navigate accordingly when calling goTo directly', () => {
      component.goTo('login');
      expect(router.navigate).toHaveBeenCalledWith(['/login']);

      component.goTo('register');
      expect(router.navigate).toHaveBeenCalledWith(['/register']);
    });
  });

  describe('when logged in', () => {
    beforeEach(() => {
      user.set({ id: 1, email: 'john@doe.dev', username: 'JohnDoe' });
      fixture.detectChanges();
    });

    it('should greet the user by name', () => {
      expect(fixture.nativeElement.textContent).toContain('Bienvenue JohnDoe');
    });

    it('should not render the login/register buttons', () => {
      const labels = fixture.debugElement
        .queryAll(By.css('app-button'))
        .map((button) => button.nativeElement.textContent.trim());

      expect(labels).toEqual(['Se déconnecter']);
    });

    it('should call auth.logout when clicking the logout button', () => {
      const [logoutButton] = fixture.debugElement.queryAll(By.css('app-button button'));

      logoutButton.nativeElement.click();
      fixture.detectChanges();

      expect(logout).toHaveBeenCalled();
      expect(fixture.nativeElement.textContent).toContain('Se connecter');
    });
  });
});
