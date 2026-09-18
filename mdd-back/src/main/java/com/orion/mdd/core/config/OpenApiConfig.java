package com.orion.mdd.core.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import io.swagger.v3.oas.models.Components;
import io.swagger.v3.oas.models.OpenAPI;
import io.swagger.v3.oas.models.info.Info;
import io.swagger.v3.oas.models.security.SecurityScheme;

/**
 * Configuration de la documentation OpenAPI/Swagger de l'API.
 */
@Configuration
public class OpenApiConfig {
    /**
     * Décrit l'API (titre, description, version) et déclare le schéma de sécurité
     * "bearerAuth" (JWT) utilisé par les endpoints protégés.
     *
     * @return la configuration OpenAPI de l'application
     */
    @Bean
    public OpenAPI mddOpenAPI() {
        return new OpenAPI()
            .info(new Info()
                .title("MDD API")
                .description("Back-end du réseau social MDD (Monde de Dév)")
                .version("1.0"))
            .components(new Components()
                .addSecuritySchemes("bearerAuth",
                    new SecurityScheme()
                        .type(SecurityScheme.Type.HTTP)
                        .scheme("bearer")
                        .bearerFormat("JWT")));
    }
}
