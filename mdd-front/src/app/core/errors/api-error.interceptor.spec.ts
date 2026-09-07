import { TestBed } from '@angular/core/testing';
import { HttpClient, provideHttpClient, withInterceptors } from '@angular/common/http';
import {
  HttpTestingController,
  provideHttpClientTesting,
} from '@angular/common/http/testing';
import { apiErrorInterceptor } from './api-error.interceptor';
import { ApiError } from './api-error';

describe('apiErrorInterceptor', () => {
  let http: HttpClient;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        provideHttpClient(withInterceptors([apiErrorInterceptor])),
        provideHttpClientTesting(),
      ],
    });
    http = TestBed.inject(HttpClient);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => httpMock.verify());

  it('converts an error response into an ApiError', () => {
    let caught: unknown;
    http.get('/api/resource').subscribe({ error: (e) => (caught = e) });

    httpMock
      .expectOne('/api/resource')
      .flush({ status: 409, detail: 'Email pris' }, { status: 409, statusText: 'Conflict' });

    expect(caught).toBeInstanceOf(ApiError);
    expect((caught as ApiError).status).toBe(409);
    expect((caught as ApiError).message).toBe('Email pris');
  });

  it('passes successful responses through untouched', () => {
    let body: unknown;
    http.get('/api/resource').subscribe((b) => (body = b));

    httpMock.expectOne('/api/resource').flush({ ok: true });

    expect(body).toEqual({ ok: true });
  });
});
