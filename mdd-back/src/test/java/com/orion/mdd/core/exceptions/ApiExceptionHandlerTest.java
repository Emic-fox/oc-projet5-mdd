package com.orion.mdd.core.exceptions;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import java.util.List;
import java.util.Map;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Nested;
import org.junit.jupiter.api.Tag;
import org.junit.jupiter.api.Test;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ProblemDetail;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.BeanPropertyBindingResult;
import org.springframework.validation.BindingResult;
import org.springframework.validation.FieldError;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.context.request.WebRequest;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;

/**
 * Tests unitaires de {@link ApiExceptionHandler} : traduction des {@link ApiException} en
 * {@link ProblemDetail} (statut et message) et enrichissement des erreurs de validation.
 * Montés via un MockMvc standalone avec un contrôleur jetable.
 */
@Tag("unit")
@DisplayName("ApiExceptionHandler")
class ApiExceptionHandlerTest {

    private MockMvc mockMvc;

    @BeforeEach
    void setUp() {
        mockMvc = MockMvcBuilders.standaloneSetup(new TestController())
                .setControllerAdvice(new ApiExceptionHandler())
                .build();
    }

    // --- Exceptions de test --------------------------------------------------

    @ResponseStatus(value = HttpStatus.CONFLICT, reason = "Ressource en conflit")
    static class ConflictException extends ApiException {
        ConflictException() {
            super();
        }

        ConflictException(String message) {
            super(message);
        }
    }

    @ResponseStatus(HttpStatus.NOT_FOUND)
    static class NoReasonException extends ApiException {
        NoReasonException() {
            super();
        }
    }

    static class UnannotatedException extends ApiException {
        UnannotatedException() {
            super("boom");
        }
    }

    @RestController
    static class TestController {

        @GetMapping("/conflict-no-message")
        String conflictNoMessage() {
            throw new ConflictException();
        }

        @GetMapping("/conflict-with-message")
        String conflictWithMessage() {
            throw new ConflictException("Le username alice est déjà pris");
        }

        @GetMapping("/no-reason")
        String noReason() {
            throw new NoReasonException();
        }

        @GetMapping("/unannotated")
        String unannotated() {
            throw new UnannotatedException();
        }
    }

    @Nested
    @DisplayName("handleApiException")
    class HandleApiException {

        @Test
        @DisplayName("utilise le statut du @ResponseStatus et le reason comme message par défaut")
        void usesResponseStatusAndReason() throws Exception {
            mockMvc.perform(get("/conflict-no-message"))
                    .andExpect(status().isConflict())
                    .andExpect(jsonPath("$.status").value(409))
                    .andExpect(jsonPath("$.detail").value("Ressource en conflit"));
        }

        @Test
        @DisplayName("le message de l'exception surcharge le reason du @ResponseStatus")
        void exceptionMessageOverridesReason() throws Exception {
            mockMvc.perform(get("/conflict-with-message"))
                    .andExpect(status().isConflict())
                    .andExpect(jsonPath("$.detail").value("Le username alice est déjà pris"));
        }

        @Test
        @DisplayName("sans message ni reason, retombe sur le libellé standard du statut")
        void fallsBackToStatusReasonPhrase() throws Exception {
            mockMvc.perform(get("/no-reason"))
                    .andExpect(status().isNotFound())
                    .andExpect(jsonPath("$.detail").value("Not Found"));
        }

        @Test
        @DisplayName("sans @ResponseStatus, répond 500 avec le message de l'exception")
        void defaultsToInternalServerErrorWhenNoAnnotation() throws Exception {
            mockMvc.perform(get("/unannotated"))
                    .andExpect(status().isInternalServerError())
                    .andExpect(jsonPath("$.status").value(500))
                    .andExpect(jsonPath("$.detail").value("boom"));
        }
    }

    @Nested
    @DisplayName("handleMethodArgumentNotValid")
    class HandleMethodArgumentNotValid {

        private final ApiExceptionHandler handler = new ApiExceptionHandler();

        private MethodArgumentNotValidException exceptionWith(FieldError... fieldErrors) {
            BindingResult bindingResult = new BeanPropertyBindingResult(new Object(), "body");
            for (FieldError error : fieldErrors) {
                bindingResult.addError(error);
            }
            MethodArgumentNotValidException ex = mock(MethodArgumentNotValidException.class);
            when(ex.getBindingResult()).thenReturn(bindingResult);
            when(ex.getBody()).thenReturn(ProblemDetail.forStatus(HttpStatus.BAD_REQUEST));
            return ex;
        }

        @SuppressWarnings("unchecked")
        private List<Map<String, String>> errorsOf(ResponseEntity<Object> response) {
            ProblemDetail body = (ProblemDetail) response.getBody();
            return (List<Map<String, String>>) body.getProperties().get("errors");
        }

        @Test
        @DisplayName("ajoute la liste des champs en erreur avec leur message de contrainte")
        void addsFieldErrorsToBody() {
            MethodArgumentNotValidException ex = exceptionWith(
                    new FieldError("body", "email", "ne doit pas être vide"),
                    new FieldError("body", "password", "trop court"));

            ResponseEntity<Object> response = handler.handleMethodArgumentNotValid(
                    ex, new HttpHeaders(), HttpStatus.BAD_REQUEST, mock(WebRequest.class));

            assertThat(errorsOf(response)).containsExactly(
                    Map.of("field", "email", "message", "ne doit pas être vide"),
                    Map.of("field", "password", "message", "trop court"));
        }

        @Test
        @DisplayName("remplace un message de contrainte absent par 'invalid'")
        void usesInvalidWhenDefaultMessageIsNull() {
            MethodArgumentNotValidException ex = exceptionWith(
                    new FieldError("body", "email", null, false, null, null, null));

            ResponseEntity<Object> response = handler.handleMethodArgumentNotValid(
                    ex, new HttpHeaders(), HttpStatus.BAD_REQUEST, mock(WebRequest.class));

            assertThat(errorsOf(response)).containsExactly(Map.of("field", "email", "message", "invalid"));
        }
    }
}
