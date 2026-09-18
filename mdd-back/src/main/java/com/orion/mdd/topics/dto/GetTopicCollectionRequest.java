package com.orion.mdd.topics.dto;

import io.swagger.v3.oas.annotations.media.Schema;

/**
 * Paramètres de filtrage de la requête de listing des thèmes.
 *
 * @param subscribed si {@code true}, ne renvoie que les thèmes souscrits par l'utilisateur connecté
 */
public record GetTopicCollectionRequest(
    @Schema(description = "Permet de ne remonter que les topics souscrits par l'utilisateur connecté", example = "false", defaultValue = "false")
    Boolean subscribed
) {
    /** Normalise {@code subscribed} à {@code false} lorsqu'il n'est pas fourni. */
    public GetTopicCollectionRequest {
        subscribed = subscribed != null && subscribed;
    }
}
