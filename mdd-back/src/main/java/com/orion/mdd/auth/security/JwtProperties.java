package com.orion.mdd.auth.security;

import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.validation.annotation.Validated;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Positive;

/**
 * Paramètres du JWT, alimentés par {@code orion.mdd.jwt.*}
 * (eux-mêmes issus des variables {@code JWT_SECRET} / {@code JWT_EXPIRATION_MS} du .env).
 *
 * @param secret       clé de signature HMAC encodée en Base64 (256 bits minimum pour HS256)
 * @param expirationMs durée de validité d'un jeton, en millisecondes
 */
@Validated
@ConfigurationProperties(prefix = "orion.mdd.jwt")
public record JwtProperties(
        @NotBlank String secret,
        @Positive long expirationMs) {
}
