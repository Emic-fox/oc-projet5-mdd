import { HttpErrorResponse } from '@angular/common/http';
import { ApiError } from './api-error';

describe('ApiError', () => {
  const from = (init: { status: number; error?: unknown }) =>
    ApiError.from(new HttpErrorResponse(init));

  it('is an Error instance', () => {
    expect(from({ status: 500 })).toBeInstanceOf(Error);
  });

  it('uses a network message on status 0', () => {
    expect(from({ status: 0 }).message).toContain(
      'Impossible de contacter le serveur',
    );
  });

  it('uses the ProblemDetail detail when present', () => {
    const err = from({ status: 409, error: { status: 409, detail: 'Email pris' } });
    expect(err.message).toBe('Email pris');
    expect(err.problem?.detail).toBe('Email pris');
  });

  it('falls back to a generic message', () => {
    expect(from({ status: 500 }).message).toBe(
      'Une erreur est survenue. Veuillez réessayer.',
    );
  });

  it('maps field errors, first message per field wins', () => {
    const err = from({
      status: 400,
      error: {
        status: 400,
        errors: [
          { field: 'email', message: 'invalide' },
          { field: 'email', message: 'requis' },
        ],
      },
    });
    expect(err.fieldErrors).toEqual({ email: 'invalide' });
  });

  describe('messageFor', () => {
    it('returns the override for the matching status', () => {
      expect(from({ status: 401 }).messageFor({ 401: 'Identifiants incorrects' })).toBe(
        'Identifiants incorrects',
      );
    });

    it('returns the default message when no override matches', () => {
      expect(
        from({ status: 409, error: { status: 409, detail: 'Email pris' } }).messageFor({
          401: 'x',
        }),
      ).toBe('Email pris');
    });
  });
});
