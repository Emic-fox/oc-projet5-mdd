import { TestBed } from '@angular/core/testing';
import { HttpClient, provideHttpClient, withInterceptors } from '@angular/common/http';
import {
  HttpTestingController,
  provideHttpClientTesting,
} from '@angular/common/http/testing';
import { vi } from 'vitest';
import { apiErrorInterceptor } from './api-error.interceptor';
import { ApiError } from './api-error';
import { Logger } from '@app/core/services/logger.service';

describe('apiErrorInterceptor', () => {
  let http: HttpClient;
  let httpMock: HttpTestingController;
  let logger: Logger;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        provideHttpClient(withInterceptors([apiErrorInterceptor])),
        provideHttpClientTesting(),
      ],
    });
    http = TestBed.inject(HttpClient);
    httpMock = TestBed.inject(HttpTestingController);
    logger = TestBed.inject(Logger);
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

  it('logs the error exactly once via Logger', () => {
    const errorSpy = vi.spyOn(logger, 'error');
    http.get('/api/resource').subscribe({ error: () => {} });

    httpMock
      .expectOne('/api/resource')
      .flush({ status: 409, detail: 'Email pris' }, { status: 409, statusText: 'Conflict' });

    expect(errorSpy).toHaveBeenCalledTimes(1);
    expect(errorSpy).toHaveBeenCalledWith(
      expect.stringContaining('/api/resource'),
      expect.any(ApiError),
    );
  });

  it('passes successful responses through untouched', () => {
    let body: unknown;
    http.get('/api/resource').subscribe((b) => (body = b));

    httpMock.expectOne('/api/resource').flush({ ok: true });

    expect(body).toEqual({ ok: true });
  });
});
