package com.orion.mdd.articles.exceptions;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ResponseStatus;

import com.orion.mdd.core.exceptions.ApiException;

/**
 * Exception levée lorsqu'un article demandé n'existe pas. Traduite en réponse HTTP 404
 * par {@link com.orion.mdd.core.exceptions.ApiErrorHandler}.
 */
@ResponseStatus(value = HttpStatus.NOT_FOUND, reason = "Article not found")
public class ArticleNotFoundException extends ApiException {

    /** Construit l'exception avec le message par défaut. */
    public ArticleNotFoundException() {
        super();
    }

    /**
     * Construit l'exception avec un message personnalisé.
     *
     * @param message message décrivant l'erreur
     */
    public ArticleNotFoundException(String message) {
        super(message);
    }

}
