package com.orion.mdd.auth.dto;

import com.orion.mdd.auth.validation.StrongPassword;
import com.orion.mdd.users.validation.Username;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;

public record RegisterRequest(
        @Schema(description = "Adresse e-mail de l'utilisateur", example = "john.doe@example.com")
        @NotBlank @Email String email,

        @Schema(description = "Nom d'utilisateur", example = "john_doe")
        @Username String username,

        @Schema(description = "Mot de passe de l'utilisateur", example = "Password123!")
        @StrongPassword String password
) { }
