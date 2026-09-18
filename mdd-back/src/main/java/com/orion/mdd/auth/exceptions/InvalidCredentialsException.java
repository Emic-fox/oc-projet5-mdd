package com.orion.mdd.auth.exceptions;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ResponseStatus;

import com.orion.mdd.core.exceptions.ApiException;

/** Levée lorsque les identifiants fournis lors de la connexion sont invalides. */
@ResponseStatus(value = HttpStatus.UNAUTHORIZED, reason = "Invalid credentials")
public class InvalidCredentialsException extends ApiException {

    /** Crée l'exception avec le statut HTTP 401 (Unauthorized) associé. */
    public InvalidCredentialsException() {
        super();
    }

}
