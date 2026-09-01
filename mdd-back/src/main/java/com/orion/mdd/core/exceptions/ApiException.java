package com.orion.mdd.core.exceptions;

/**
 * Classe de base des exceptions traduites en réponse HTTP d'erreur.
 * Chaque sous-classe DOIT être annotée avec {@link org.springframework.web.bind.annotation.ResponseStatus}
 * pour déclarer son statut HTTP ; {@code ApiExceptionHandler} lit cette annotation pour construire la réponse.
 *
 * Utiliser le constructeur sans argument pour que le {@code reason} de {@code @ResponseStatus}
 * serve de message de réponse, ou passer un message pour le surcharger ponctuellement.
 */
public abstract class ApiException extends RuntimeException {

    protected ApiException() {
        super();
    }

    protected ApiException(String message) {
        super(message);
    }
}
