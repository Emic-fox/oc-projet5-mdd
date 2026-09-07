import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpErrorResponse } from '@angular/common/http';
import { Router } from '@angular/router';
import { of, throwError } from 'rxjs';
import { LoginPage } from './login-page';
import { AuthService } from '../../services/auth.service';

describe('LoginPage', () => {
  let component: LoginPage;
  let fixture: ComponentFixture<LoginPage>;
  let login: ReturnType<typeof vi.fn>;
  let navigate: ReturnType<typeof vi.fn>;

  beforeEach(async () => {
    login = vi.fn().mockReturnValue(of({ token: 'jwt' }));
    navigate = vi.fn().mockResolvedValue(true);

    await TestBed.configureTestingModule({
      imports: [LoginPage],
      providers: [
        { provide: AuthService, useValue: { login } },
        { provide: Router, useValue: { navigate } },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(LoginPage);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should call the auth service and navigate home on success', () => {
    component.onLogin({ login: 'JohnDoe', password: 'secret' });
    expect(login).toHaveBeenCalledWith('JohnDoe', 'secret');
    expect(navigate).toHaveBeenCalledWith(['/']);
  });

  const failWith = (init: { status: number; error?: unknown }) =>
    login.mockReturnValue(throwError(() => new HttpErrorResponse(init)));

  it('should display a credentials error on 401', () => {
    failWith({ status: 401 });
    component.onLogin({ login: 'JohnDoe', password: 'wrong' });
    fixture.detectChanges();
    expect(navigate).not.toHaveBeenCalled();
    expect(fixture.nativeElement.textContent).toContain(
      'Identifiant ou mot de passe incorrect.',
    );
  });

  it('should surface the API detail message for other statuses', () => {
    failWith({ status: 409, error: { status: 409, detail: 'Email already used' } });
    component.onLogin({ login: 'JohnDoe', password: 'secret' });
    fixture.detectChanges();
    expect(fixture.nativeElement.textContent).toContain('Email already used');
  });

  it('should show a network error message when the server is unreachable', () => {
    failWith({ status: 0 });
    component.onLogin({ login: 'JohnDoe', password: 'secret' });
    fixture.detectChanges();
    expect(fixture.nativeElement.textContent).toContain(
      'Impossible de contacter le serveur',
    );
  });
});
