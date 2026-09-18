package com.orion.mdd.users.exceptions;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ResponseStatus;

import com.orion.mdd.core.exceptions.ApiException;

/**
 * Levée lorsqu'aucun utilisateur ne correspond à l'identifiant ou au critère de recherche demandé.
 */
@ResponseStatus(value = HttpStatus.NOT_FOUND, reason = "User not found")
public class UserNotFoundException extends ApiException {

    /** Crée l'exception avec le message par défaut porté par {@code @ResponseStatus}. */
    public UserNotFoundException() {
        super();
    }

    /** @param message message décrivant précisément l'erreur */
    public UserNotFoundException(String message) {
        super(message);
    }

}
