package com.orion.mdd.articles.dto;

import com.fasterxml.jackson.annotation.JsonProperty;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public record CreateArticleRequest(
    @Schema(description = "Identifiant du thème de l'article", example = "1")
    @JsonProperty("topic_id")
    @NotNull Long topicId,

    @Schema(description = "Titre de l'article", example = "Introduction à Spring Boot")
    @NotBlank String title,

    @Schema(description = "Contenu de l'article", example = "Spring Boot est un framework...")
    @NotBlank String content
) { }
