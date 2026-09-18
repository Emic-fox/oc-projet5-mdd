package com.orion.mdd.articles.dto;

import java.time.LocalDateTime;

import io.swagger.v3.oas.annotations.media.Schema;

/**
 * DTO de réponse représentant un article, avec des références allégées à son thème et son auteur.
 */
public record ArticleResponse(
    @Schema(description = "Identifiant de l'article", example = "1")
    Long id,

    @Schema(description = "Titre de l'article", example = "Introduction à Spring Boot")
    String title,

    @Schema(description = "Contenu de l'article", example = "Spring Boot est un framework...")
    String content,

    TopicRef topic,

    AuthorRef author,

    @Schema(description = "Date de création de l'article", example = "2025-01-01T12:00:00")
    LocalDateTime createdAt
) {
    /** Référence allégée au thème d'un article. */
    @Schema(name = "ArticleTopicRef")
    public record TopicRef(
        @Schema(description = "Identifiant du topic", example = "1")
        Long id,

        @Schema(description = "Nom du topic", example = "Développement")
        String name
    ) { }

    /** Référence allégée à l'auteur d'un article. */
    @Schema(name = "ArticleAuthorRef")
    public record AuthorRef(
        @Schema(description = "Identifiant de l'auteur", example = "1")
        Long id,

        @Schema(description = "Nom d'utilisateur de l'auteur", example = "alice")
        String username
    ) { }
}
