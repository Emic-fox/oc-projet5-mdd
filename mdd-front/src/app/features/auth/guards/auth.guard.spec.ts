import { TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { authGuard } from './auth.guard';
import { AuthService } from '../services/auth.service';

describe('authGuard', () => {
  let isAuthenticated: boolean;
  let router: Router;

  beforeEach(() => {
    isAuthenticated = true;

    TestBed.configureTestingModule({
      providers: [
        { provide: AuthService, useValue: { isAuthenticated: () => isAuthenticated } },
      ],
    });

    router = TestBed.inject(Router);
  });

  const run = () => TestBed.runInInjectionContext(() => authGuard({} as never, {} as never));

  it('allows navigation when authenticated', () => {
    expect(run()).toBe(true);
  });

  it('redirects to home when not authenticated', () => {
    isAuthenticated = false;

    const result = run();

    expect(result).toEqual(router.createUrlTree(['/']));
  });
});
