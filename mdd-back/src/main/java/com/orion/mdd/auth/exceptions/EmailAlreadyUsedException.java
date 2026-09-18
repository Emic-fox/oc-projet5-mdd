package com.orion.mdd.auth.exceptions;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ResponseStatus;

import com.orion.mdd.core.exceptions.ApiException;

/** Levée lorsqu'une adresse email est déjà utilisée par un autre compte (inscription ou mise à jour du profil). */
@ResponseStatus(value = HttpStatus.CONFLICT, reason = "Email already used")
public class EmailAlreadyUsedException extends ApiException {

    /** Crée l'exception avec le statut HTTP 409 (Conflict) associé. */
    public EmailAlreadyUsedException() {
        super();
    }

}
