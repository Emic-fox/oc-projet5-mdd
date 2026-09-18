package com.orion.mdd.articles.dto;

import io.swagger.v3.oas.annotations.media.Schema;

/**
 * DTO de requête pour la récupération du fil d'articles, portant l'ordre de tri souhaité.
 */
public record GetArticleCollectionRequest(
    @Schema(description = "Ordre de tri par date de création", example = "desc", defaultValue = "desc", allowableValues = { "asc", "desc" })
    String sort
) {
    /**
     * Normalise le paramètre {@code sort} : toute valeur autre que {@code "asc"} (insensible
     * à la casse) est ramenée à {@code "desc"}.
     */
    public GetArticleCollectionRequest {
        sort = "asc".equalsIgnoreCase(sort) ? "asc" : "desc";
    }

    /**
     * Indique si le tri demandé est par date de création croissante.
     *
     * @return {@code true} si l'ordre est ascendant, {@code false} sinon
     */
    public boolean ascending() {
        return "asc".equals(sort);
    }
}
