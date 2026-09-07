package com.orion.mdd.auth.security;

import java.util.List;

import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.validation.annotation.Validated;

/**
 * Paramètres du CORS, alimentés par {@code orion.mdd.cors.*}
 * (eux-mêmes issus des variables {@code CORS_ALLOWED_ORIGINS} du .env).
 *
 * @param allowedOrigins origines autorisées pour le CORS (front Angular)
 */
@Validated
@ConfigurationProperties(prefix = "orion.mdd.cors")
public record CorsProperties(
        List<String> allowedOrigins
) {
}
