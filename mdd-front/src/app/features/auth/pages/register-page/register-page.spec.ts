import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpErrorResponse } from '@angular/common/http';
import { Router } from '@angular/router';
import { of, throwError } from 'rxjs';
import { RegisterPage } from './register-page';
import { AuthService } from '../../services/auth.service';
import { ApiError } from '@app/core/errors/api-error';

describe('RegisterPage', () => {
  let component: RegisterPage;
  let fixture: ComponentFixture<RegisterPage>;
  let register: ReturnType<typeof vi.fn>;
  let navigate: ReturnType<typeof vi.fn>;

  const credentials = {
    username: 'john',
    email: 'john.doe@example.com',
    password: 'Abcdef1!',
  };

  beforeEach(async () => {
    register = vi.fn().mockReturnValue(of({ token: 'jwt' }));
    navigate = vi.fn().mockResolvedValue(true);

    await TestBed.configureTestingModule({
      imports: [RegisterPage],
      providers: [
        { provide: AuthService, useValue: { register } },
        { provide: Router, useValue: { navigate } },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(RegisterPage);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should call the auth service and navigate home on success', () => {
    component.onRegister(credentials);
    expect(register).toHaveBeenCalledWith('john', 'john.doe@example.com', 'Abcdef1!');
    expect(navigate).toHaveBeenCalledWith(['/']);
  });

  const failWith = (init: { status: number; error?: unknown }) =>
    register.mockReturnValue(
      throwError(() => ApiError.from(new HttpErrorResponse(init))),
    );

  it('should surface the API detail message', () => {
    failWith({ status: 409, error: { status: 409, detail: 'Email already used' } });
    component.onRegister(credentials);
    fixture.detectChanges();
    expect(navigate).not.toHaveBeenCalled();
    expect(fixture.nativeElement.textContent).toContain('Email already used');
  });

  it('should show a generic message when no detail is provided', () => {
    failWith({ status: 500 });
    component.onRegister(credentials);
    fixture.detectChanges();
    expect(fixture.nativeElement.textContent).toContain(
      'Une erreur est survenue. Veuillez réessayer.',
    );
  });

  it('should show a network error message when the server is unreachable', () => {
    failWith({ status: 0 });
    component.onRegister(credentials);
    fixture.detectChanges();
    expect(fixture.nativeElement.textContent).toContain(
      'Impossible de contacter le serveur',
    );
  });
});
