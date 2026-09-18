package com.orion.mdd.topics.exceptions;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ResponseStatus;

import com.orion.mdd.core.exceptions.ApiException;

/**
 * Levée lorsqu'aucun thème ne correspond à l'identifiant demandé.
 */
@ResponseStatus(value = HttpStatus.NOT_FOUND, reason = "Topic not found")
public class TopicNotFoundException extends ApiException {

    /** Crée l'exception avec le message par défaut porté par {@code @ResponseStatus}. */
    public TopicNotFoundException() {
        super();
    }

    /** @param message message décrivant précisément l'erreur */
    public TopicNotFoundException(String message) {
        super(message);
    }

}
