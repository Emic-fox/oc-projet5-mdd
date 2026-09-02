package com.orion.mdd.auth.dto;

import java.time.LocalDateTime;

import io.swagger.v3.oas.annotations.media.Schema;

public record MeResponse(
        @Schema(description = "Identifiant de l'utilisateur", example = "1")
        Long id,

        @Schema(description = "Adresse e-mail de l'utilisateur", example = "john.doe@example.com")
        String email,

        @Schema(description = "Nom d'utilisateur", example = "john_doe")
        String username,

        @Schema(description = "Date de création du compte", example = "2026-09-01T00:00:00")
        LocalDateTime createdAt
) { }
