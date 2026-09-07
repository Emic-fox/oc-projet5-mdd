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

  const configure = (token: string | null) => {
    TestBed.configureTestingModule({
      providers: [
        provideHttpClient(withInterceptors([authInterceptor])),
        provideHttpClientTesting(),
        { provide: TokenStore, useValue: { token: () => token } },
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
});
