import { TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { guestGuard } from './guest.guard';
import { AuthService } from '../services/auth.service';

describe('guestGuard', () => {
  let isAuthenticated: boolean;
  let router: Router;

  beforeEach(() => {
    isAuthenticated = false;

    TestBed.configureTestingModule({
      providers: [
        { provide: AuthService, useValue: { isAuthenticated: () => isAuthenticated } },
      ],
    });

    router = TestBed.inject(Router);
  });

  const run = () => TestBed.runInInjectionContext(() => guestGuard({} as never, {} as never));

  it('allows navigation when not authenticated', () => {
    expect(run()).toBe(true);
  });

  it('redirects to the articles feed when authenticated', () => {
    isAuthenticated = true;

    const result = run();

    expect(result).toEqual(router.createUrlTree(['/articles']));
  });
});
