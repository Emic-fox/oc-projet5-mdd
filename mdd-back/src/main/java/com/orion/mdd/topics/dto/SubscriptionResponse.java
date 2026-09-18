package com.orion.mdd.topics.dto;

import io.swagger.v3.oas.annotations.media.Schema;

/**
 * Réponse renvoyée après création ou suppression d'un abonnement à un thème.
 *
 * @param topic référence du thème concerné
 * @param user référence de l'utilisateur concerné
 */
public record SubscriptionResponse(
    TopicRef topic,
    UserRef user
) {
    /**
     * Référence allégée d'un thème dans une {@link SubscriptionResponse}.
     *
     * @param id identifiant du thème
     */
    @Schema(name = "SubscriptionTopicRef")
    public record TopicRef(
        @Schema(description = "Identifiant du topic", example = "1")
        Long id
    ) { }

    /**
     * Référence allégée d'un utilisateur dans une {@link SubscriptionResponse}.
     *
     * @param id identifiant de l'utilisateur
     */
    @Schema(name = "SubscriptionUserRef")
    public record UserRef(
        @Schema(description = "Identifiant de l'utilisateur", example = "1")
        Long id
    ) { }
}
