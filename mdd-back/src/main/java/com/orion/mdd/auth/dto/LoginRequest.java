package com.orion.mdd.auth.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotBlank;

public record LoginRequest(
        @Schema(description = "Adresse e-mail ou nom d'utilisateur de l'utilisateur", example = "john.doe@example.com")
        @NotBlank String login,

        @Schema(description = "Mot de passe de l'utilisateur", example = "Password123!")
        @NotBlank String password
) { }
