import { HttpErrorResponse } from '@angular/common/http';
import { ProblemDetail } from '@app/core/models/problem-detail.interface';

const NETWORK_MESSAGE =
    'Impossible de contacter le serveur. Veuillez réessayer plus tard.';
const DEFAULT_MESSAGE = 'Une erreur est survenue. Veuillez réessayer.';

/**
 * Erreur d'appel API normalisée.
 *
 * Produite par `apiErrorInterceptor` à partir d'une `HttpErrorResponse`.
 */
export class ApiError extends Error {
    constructor(
        readonly status: number,
        message: string,
        readonly fieldErrors: Record<string, string> = {},
        readonly problem: ProblemDetail | null = null,
    ) {
        super(message);
        this.name = 'ApiError';
    }

    static from(err: HttpErrorResponse): ApiError {
        const problem = (err.error as ProblemDetail | null) ?? null;
        const message =
            err.status === 0 ? NETWORK_MESSAGE : problem?.detail || DEFAULT_MESSAGE;
        return new ApiError(err.status, message, extractFieldErrors(problem), problem);
    }

    /** Message à afficher : `message` par défaut, sauf surcharge pour ce code HTTP. */
    messageFor(overrides: Record<number, string> = {}): string {
        return overrides[this.status] ?? this.message;
    }
}

/** Erreurs de validation par champ (RFC 7807 étendu). */
function extractFieldErrors(problem: ProblemDetail | null): Record<string, string> {
    const result: Record<string, string> = {};
    for (const { field, message } of problem?.errors ?? []) {
        result[field] ??= message;
    }
    return result;
}
