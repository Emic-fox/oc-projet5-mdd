package com.orion.mdd.topics.exceptions;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ResponseStatus;

import com.orion.mdd.core.exceptions.ApiException;

/**
 * Levée lorsqu'un utilisateur tente de se désabonner d'un thème auquel il n'est pas abonné.
 */
@ResponseStatus(value = HttpStatus.NOT_FOUND, reason = "Not subscribed to this topic")
public class NotSubscribedException extends ApiException {

    /** Crée l'exception avec le message par défaut porté par {@code @ResponseStatus}. */
    public NotSubscribedException() {
        super();
    }

}
