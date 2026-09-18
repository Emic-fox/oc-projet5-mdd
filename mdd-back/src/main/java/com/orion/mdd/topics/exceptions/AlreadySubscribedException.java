package com.orion.mdd.topics.exceptions;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ResponseStatus;

import com.orion.mdd.core.exceptions.ApiException;

/**
 * Levée lorsqu'un utilisateur tente de s'abonner à un thème auquel il est déjà abonné.
 */
@ResponseStatus(value = HttpStatus.CONFLICT, reason = "Already subscribed to this topic")
public class AlreadySubscribedException extends ApiException {

    /** Crée l'exception avec le message par défaut porté par {@code @ResponseStatus}. */
    public AlreadySubscribedException() {
        super();
    }

}
