package com.orion.mdd.topics.dto;

import io.swagger.v3.oas.annotations.media.Schema;

public record SubscriptionResponse(
    TopicRef topic,
    UserRef user
) {
    public record TopicRef(
        @Schema(description = "Identifiant du topic", example = "1")
        Long id
    ) { }

    public record UserRef(
        @Schema(description = "Identifiant de l'utilisateur", example = "1")
        Long id
    ) { }
}
