package com.orion.mdd.auth.security;

import java.io.IOException;

import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ProblemDetail;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.web.AuthenticationEntryPoint;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import tools.jackson.databind.ObjectMapper;

/**
 * Renvoie 401 avec un corps {@link ProblemDetail} (RFC 7807) quand l'authentification manque
 * ou est invalide, afin que le client reçoive le même format d'erreur que celui produit par
 * {@code ApiErrorHandler} (inatteignable ici : la chaîne de filtres précède les contrôleurs).
 */
class ProblemDetailAuthenticationEntryPoint implements AuthenticationEntryPoint {

    static final String DETAIL = "Authentification requise";

    private final ObjectMapper objectMapper;

    ProblemDetailAuthenticationEntryPoint(ObjectMapper objectMapper) {
        this.objectMapper = objectMapper;
    }

    @Override
    public void commence(HttpServletRequest request, HttpServletResponse response,
            AuthenticationException authException) throws IOException {
        ProblemDetail body = ProblemDetail.forStatusAndDetail(HttpStatus.UNAUTHORIZED, DETAIL);

        response.setStatus(HttpStatus.UNAUTHORIZED.value());
        response.setContentType(MediaType.APPLICATION_PROBLEM_JSON_VALUE);
        response.setCharacterEncoding("UTF-8");
        objectMapper.writeValue(response.getOutputStream(), body);
    }
}
