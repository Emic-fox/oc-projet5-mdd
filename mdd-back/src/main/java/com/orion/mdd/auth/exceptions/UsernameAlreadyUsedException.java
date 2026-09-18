package com.orion.mdd.auth.exceptions;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ResponseStatus;

import com.orion.mdd.core.exceptions.ApiException;

/** Levée lorsqu'un nom d'utilisateur est déjà utilisé par un autre compte (inscription ou mise à jour du profil). */
@ResponseStatus(value = HttpStatus.CONFLICT, reason = "Username already used")
public class UsernameAlreadyUsedException extends ApiException {

    /** Crée l'exception avec le statut HTTP 409 (Conflict) associé. */
    public UsernameAlreadyUsedException() {
        super();
    }

}
