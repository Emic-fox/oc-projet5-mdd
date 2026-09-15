import { TestBed } from '@angular/core/testing';
import { HttpClient, provideHttpClient, withInterceptors } from '@angular/common/http';
import {
  HttpTestingController,
  provideHttpClientTesting,
} from '@angular/common/http/testing';
import { authInterceptor } from './auth.interceptor';
import { TokenStore } from '../services/token-store.service';

describe('authInterceptor', () => {
  let http: HttpClient;
  let httpMock: HttpTestingController;
  let setToken: ReturnType<typeof vi.fn>;

  const configure = (token: string | null) => {
    setToken = vi.fn();

    TestBed.configureTestingModule({
      providers: [
        provideHttpClient(withInterceptors([authInterceptor])),
        provideHttpClientTesting(),
        { provide: TokenStore, useValue: { token: () => token, set: setToken } },
      ],
    });
    http = TestBed.inject(HttpClient);
    httpMock = TestBed.inject(HttpTestingController);
  };

  afterEach(() => {
    httpMock.verify();
  });

  it('should add the Authorization header when a token is present', () => {
    configure('my-jwt');

    http.get('/api/resource').subscribe();

    const req = httpMock.expectOne('/api/resource');
    expect(req.request.headers.get('Authorization')).toBe('Bearer my-jwt');
    req.flush({});
  });

  it('should leave the request untouched when there is no token', () => {
    configure(null);

    http.get('/api/resource').subscribe();

    const req = httpMock.expectOne('/api/resource');
    expect(req.request.headers.has('Authorization')).toBe(false);
    req.flush({});
  });

  it('should clear the token on a 401 for an authenticated request', () => {
    configure('my-jwt');

    http.get('/api/resource').subscribe({ error: () => {} });

    httpMock.expectOne('/api/resource').flush(null, { status: 401, statusText: 'Unauthorized' });

    expect(setToken).toHaveBeenCalledWith(null);
  });

  it('should not clear the token on a 401 when there is no token', () => {
    configure(null);

    http.get('/api/resource').subscribe({ error: () => {} });

    httpMock.expectOne('/api/resource').flush(null, { status: 401, statusText: 'Unauthorized' });

    expect(setToken).not.toHaveBeenCalled();
  });

  it('should not clear the token on a 401 from the login endpoint', () => {
    configure('stale-jwt');

    http.post('/api/auth/login', {}).subscribe({ error: () => {} });

    httpMock.expectOne('/api/auth/login').flush(null, { status: 401, statusText: 'Unauthorized' });

    expect(setToken).not.toHaveBeenCalled();
  });

  it('should not clear the token on a 401 from the register endpoint', () => {
    configure('stale-jwt');

    http.post('/api/auth/register', {}).subscribe({ error: () => {} });

    httpMock.expectOne('/api/auth/register').flush(null, { status: 401, statusText: 'Unauthorized' });

    expect(setToken).not.toHaveBeenCalled();
  });
});
