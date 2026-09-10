package com.orion.mdd.topics.dto;

import io.swagger.v3.oas.annotations.media.Schema;

public record GetTopicCollectionRequest(
    @Schema(description = "Permet de ne remonter que les topics souscrits par l'utilisateur connecté", example = "false", defaultValue = "false")
    Boolean subscribed
) {
    public GetTopicCollectionRequest {
        subscribed = subscribed != null && subscribed;
    }
}
