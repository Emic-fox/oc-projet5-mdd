/**
 * Corps d'erreur renvoyé par l'API au format RFC 7807 (Spring `ProblemDetail`).
 */
export interface ProblemDetail {
    status: number;
    title?: string;
    detail?: string;
    errors?: { field: string; message: string }[];
}
