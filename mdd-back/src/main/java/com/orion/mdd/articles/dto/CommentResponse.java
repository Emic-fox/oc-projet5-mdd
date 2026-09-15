package com.orion.mdd.articles.dto;

import java.time.LocalDateTime;

import io.swagger.v3.oas.annotations.media.Schema;

public record CommentResponse(
    @Schema(description = "Identifiant du commentaire", example = "1")
    Long id,

    @Schema(description = "Contenu du commentaire", example = "Merci pour cet article !")
    String content,

    AuthorRef author,

    @Schema(description = "Date de création du commentaire", example = "2025-01-01T12:00:00")
    LocalDateTime createdAt
) {
    @Schema(name = "CommentAuthorRef")
    public record AuthorRef(
        @Schema(description = "Identifiant de l'auteur", example = "1")
        Long id,

        @Schema(description = "Nom d'utilisateur de l'auteur", example = "alice")
        String username
    ) { }
}
