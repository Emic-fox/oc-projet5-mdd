package com.orion.mdd.auth.dto;

import com.orion.mdd.auth.validation.StrongPassword;

import io.swagger.v3.oas.annotations.media.Schema;

/** Corps de la requête de changement de mot de passe. */
public record UpdatePasswordRequest(
        @Schema(description = "Nouveau mot de passe de l'utilisateur", example = "Password123!")
        @StrongPassword String newPassword
) { }
