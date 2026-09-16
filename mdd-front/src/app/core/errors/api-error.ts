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
        readonly problem: ProblemDetail | null = null,
    ) {
        super(message);
        this.name = 'ApiError';
    }

    static from(err: HttpErrorResponse): ApiError {
        const problem = (err.error as ProblemDetail | null) ?? null;
        const baseMessage =
            err.status === 0 ? NETWORK_MESSAGE : problem?.detail || DEFAULT_MESSAGE;
        return new ApiError(err.status, withFieldDetails(baseMessage, problem), problem);
    }

    /** Message à afficher : `message` par défaut, sauf surcharge pour ce code HTTP. */
    messageFor(overrides: Record<number, string> = {}): string {
        return overrides[this.status] ?? this.message;
    }
}

/** Complète le message avec le détail des champs en erreur (RFC 7807 étendu). */
function withFieldDetails(message: string, problem: ProblemDetail | null): string {
    const errors = problem?.errors ?? [];
    if (errors.length === 0) return message;
    const details = errors.map(({ field, message }) => `${field} : ${message}`).join(', ');
    return `${message} (${details})`;
}
