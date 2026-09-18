package com.orion.mdd.articles.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotBlank;

/**
 * DTO de requête pour la création d'un commentaire.
 */
public record CreateCommentRequest(
    @Schema(description = "Contenu du commentaire", example = "Merci pour cet article !")
    @NotBlank String content
) { }
