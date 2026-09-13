package com.orion.mdd.auth.dto;

import com.orion.mdd.auth.validation.StrongPassword;

import io.swagger.v3.oas.annotations.media.Schema;

public record UpdatePasswordRequest(
        @Schema(description = "Nouveau mot de passe de l'utilisateur", example = "Password123!")
        @StrongPassword String newPassword
) { }
