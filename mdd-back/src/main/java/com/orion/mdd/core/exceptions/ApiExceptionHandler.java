package com.orion.mdd.core.exceptions;

import java.util.List;
import java.util.Map;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.core.annotation.AnnotatedElementUtils;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.HttpStatusCode;
import org.springframework.http.ProblemDetail;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestControllerAdvice;
import org.springframework.web.context.request.WebRequest;
import org.springframework.web.servlet.mvc.method.annotation.ResponseEntityExceptionHandler;

/**
 * Traduit les {@link ApiException} en réponses HTTP au format {@link ProblemDetail} (RFC 7807).
 * Le statut HTTP provient du {@code @ResponseStatus} porté par la sous-classe.
 */
@RestControllerAdvice
public class ApiExceptionHandler extends ResponseEntityExceptionHandler {

    private static final Logger log = LoggerFactory.getLogger(ApiExceptionHandler.class);

    /**
     * Construit la réponse d'erreur à partir de l'exception.
     * Le message est résolu dans l'ordre : message de l'exception, puis {@code reason}
     * du {@code @ResponseStatus}, puis libellé standard du statut. Les erreurs 5xx sont
     * journalisées avec leur pile, les autres en niveau debug.
     */
    @ExceptionHandler(ApiException.class)
    public ResponseEntity<Object> handleApiException(ApiException ex, WebRequest request) {
        ResponseStatus responseStatus =
                AnnotatedElementUtils.findMergedAnnotation(ex.getClass(), ResponseStatus.class);

        HttpStatus status = responseStatus != null ? responseStatus.value() : HttpStatus.INTERNAL_SERVER_ERROR;
        String reason = responseStatus != null ? responseStatus.reason() : "";

        if (status.is5xxServerError()) {
            log.error("Unhandled API exception", ex);
        } else {
            log.debug("API exception: {}", ex.getMessage());
        }

        String message = ex.getMessage();
        if (message == null || message.isEmpty()) {
            message = !reason.isEmpty() ? reason : status.getReasonPhrase();
        }

        ProblemDetail body = super.createProblemDetail(ex, status, message, null, null, request);

        return super.handleExceptionInternal(ex, body, new HttpHeaders(), status, request);
    }

    /**
     * Enrichit la réponse de validation ({@code @Valid} sur un corps de requête) avec la liste
     * des champs en erreur et le message de chaque contrainte violée.
     */
    @Override
    protected ResponseEntity<Object> handleMethodArgumentNotValid(MethodArgumentNotValidException ex,
            HttpHeaders headers, HttpStatusCode status, WebRequest request) {

        List<Map<String, String>> errors = ex.getBindingResult().getFieldErrors().stream()
                .map(error -> Map.of(
                        "field", error.getField(),
                        "message", error.getDefaultMessage() != null ? error.getDefaultMessage() : "invalid"))
                .toList();

        ProblemDetail body = ex.getBody();
        body.setProperty("errors", errors);

        return super.handleExceptionInternal(ex, body, headers, status, request);
    }
}
