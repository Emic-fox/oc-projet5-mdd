import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import {
  HttpTestingController,
  provideHttpClientTesting,
} from '@angular/common/http/testing';
import { AuthService } from './auth.service';
import { TokenStore } from './token-store.service';
import { environment } from '@/environments/environment';

const url = (suffix: string) => `${environment.apiUrl}/api/auth${suffix}`;

describe('AuthService', () => {
  const me = { id: 1, email: 'john@doe.dev', username: 'JohnDoe' };

  let service: AuthService;
  let httpMock: HttpTestingController;
  let tokenStore: TokenStore;

  const build = () => {
    TestBed.resetTestingModule();
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting()],
    });
    tokenStore = TestBed.inject(TokenStore);
    service = TestBed.inject(AuthService);
    httpMock = TestBed.inject(HttpTestingController);
  };

  beforeEach(() => {
    localStorage.clear();
    build();
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should not load the user when no token is stored', () => {
    httpMock.expectNone(url('/me'));
    expect(service.getCurrentUser()).toBeNull();
  });

  it('should load the current user on creation when a token is already stored', () => {
    localStorage.setItem('token', 'existing-jwt');

    build();

    httpMock.expectOne(url('/me')).flush(me);
    expect(service.getCurrentUser()).toEqual(me);
  });

  it('should drop a stored token that the API rejects', () => {
    localStorage.setItem('token', 'stale-jwt');

    build();

    httpMock
      .expectOne(url('/me'))
      .flush(null, { status: 401, statusText: 'Unauthorized' });

    expect(service.getToken()).toBeNull();
    expect(localStorage.getItem('token')).toBeNull();
    expect(service.getCurrentUser()).toBeNull();
  });

  it('should authenticate, persist the token and load the user on login', () => {
    service.login('JohnDoe', 'secret').subscribe();

    const loginReq = httpMock.expectOne(url('/login'));
    expect(loginReq.request.method).toBe('POST');
    expect(loginReq.request.body).toEqual({ login: 'JohnDoe', password: 'secret' });
    loginReq.flush({ token: 'jwt' });

    httpMock.expectOne(url('/me')).flush(me);

    expect(tokenStore.token()).toBe('jwt');
    expect(service.getToken()).toBe('jwt');
    expect(service.getCurrentUser()).toEqual(me);
  });

  it('should authenticate and persist the token on register', () => {
    service.register('JohnDoe', 'john@doe.dev', 'secret').subscribe();

    const registerReq = httpMock.expectOne(url('/register'));
    expect(registerReq.request.method).toBe('POST');
    expect(registerReq.request.body).toEqual({
      username: 'JohnDoe',
      email: 'john@doe.dev',
      password: 'secret',
    });
    registerReq.flush({ token: 'jwt' });

    httpMock.expectOne(url('/me')).flush(me);

    expect(tokenStore.token()).toBe('jwt');
    expect(service.getCurrentUser()).toEqual(me);
  });

  it('should clear the token and the current user on logout', () => {
    service.login('JohnDoe', 'secret').subscribe();
    httpMock.expectOne(url('/login')).flush({ token: 'jwt' });
    httpMock.expectOne(url('/me')).flush(me);

    service.logout();

    expect(tokenStore.token()).toBeNull();
    expect(localStorage.getItem('token')).toBeNull();
    expect(service.getCurrentUser()).toBeNull();
  });

  it('should reload the current user on demand via refreshUser', () => {
    localStorage.setItem('token', 'jwt');
    build();
    httpMock.expectOne(url('/me')).flush(me);

    service.refreshUser();

    httpMock.expectOne(url('/me')).flush({ ...me, username: 'JaneDoe' });
    expect(service.getCurrentUser()?.username).toBe('JaneDoe');
  });

  it('should update the profile and store the renewed token', () => {
    service.login('JohnDoe', 'secret').subscribe();
    httpMock.expectOne(url('/login')).flush({ token: 'jwt' });
    httpMock.expectOne(url('/me')).flush(me);

    service.updateProfile('JaneDoe', 'jane@doe.dev').subscribe();

    const updateReq = httpMock.expectOne(url('/me'));
    expect(updateReq.request.method).toBe('PUT');
    expect(updateReq.request.body).toEqual({ username: 'JaneDoe', email: 'jane@doe.dev' });
    updateReq.flush({ user: { ...me, username: 'JaneDoe', email: 'jane@doe.dev' }, token: 'new-jwt' });

    expect(tokenStore.token()).toBe('new-jwt');
    expect(service.getToken()).toBe('new-jwt');
    expect(localStorage.getItem('token')).toBe('new-jwt');
    expect(service.getCurrentUser()?.username).toBe('JaneDoe');
  });

  it('should update the password', () => {
    service.updatePassword('NewPassword1!').subscribe();

    const req = httpMock.expectOne(url('/me/password'));
    expect(req.request.method).toBe('PUT');
    expect(req.request.body).toEqual({ newPassword: 'NewPassword1!' });
    req.flush({});
  });
});
