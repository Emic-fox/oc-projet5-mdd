package com.orion.mdd.articles.dto;

import io.swagger.v3.oas.annotations.media.Schema;

public record GetArticleCollectionRequest(
    @Schema(description = "Ordre de tri par date de création", example = "desc", defaultValue = "desc", allowableValues = { "asc", "desc" })
    String sort
) {
    public GetArticleCollectionRequest {
        sort = "asc".equalsIgnoreCase(sort) ? "asc" : "desc";
    }

    public boolean ascending() {
        return "asc".equals(sort);
    }
}
