package com.orion.mdd.core.exceptions;

/**
 * Classe de base des exceptions traduites en réponse HTTP d'erreur.
 * Chaque sous-classe DOIT être annotée avec {@link org.springframework.web.bind.annotation.ResponseStatus}
 * pour déclarer son statut HTTP ; {@code ApiErrorHandler} lit cette annotation pour construire la réponse.
 *
 * Utiliser le constructeur sans argument pour que le {@code reason} de {@code @ResponseStatus}
 * serve de message de réponse, ou passer un message pour le surcharger ponctuellement.
 */
public abstract class ApiException extends RuntimeException {

    /** Crée l'exception sans message : le {@code reason} de {@code @ResponseStatus} sera utilisé. */
    protected ApiException() {
        super();
    }

    /** @param message message qui surcharge le {@code reason} de {@code @ResponseStatus} */
    protected ApiException(String message) {
        super(message);
    }
}
