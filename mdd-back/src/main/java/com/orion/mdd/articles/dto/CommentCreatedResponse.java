package com.orion.mdd.articles.dto;

import java.time.LocalDateTime;

import io.swagger.v3.oas.annotations.media.Schema;

/**
 * DTO de réponse renvoyé après la création d'un commentaire, incluant une référence
 * allégée à l'article commenté.
 */
public record CommentCreatedResponse(
    @Schema(description = "Identifiant du commentaire", example = "1")
    Long id,

    @Schema(description = "Contenu du commentaire", example = "Merci pour cet article !")
    String content,

    CommentResponse.AuthorRef author,

    ArticleRef article,

    @Schema(description = "Date de création du commentaire", example = "2025-01-01T12:00:00")
    LocalDateTime createdAt
) {
    /** Référence allégée à l'article commenté. */
    @Schema(name = "CommentArticleRef")
    public record ArticleRef(
        @Schema(description = "Identifiant de l'article", example = "1")
        Long id,

        @Schema(description = "Titre de l'article", example = "Introduction à Spring Boot")
        String title
    ) { }
}
