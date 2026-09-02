package com.orion.mdd.auth.security;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;

import java.util.Base64;

import org.junit.jupiter.api.Test;

import io.jsonwebtoken.ExpiredJwtException;
import io.jsonwebtoken.JwtException;

class JwtServiceTest {

    private static final String SECRET = Base64.getEncoder()
            .encodeToString("this-is-a-very-long-test-secret-for-hs256-signing!!".getBytes());
    private static final String OTHER_SECRET = Base64.getEncoder()
            .encodeToString("another-completely-different-secret-key-for-hs256!!".getBytes());

    private JwtService jwtService(String secret, long expirationMs) {
        return new JwtService(new JwtProperties(secret, expirationMs));
    }

    @Test
    void generateThenExtract_roundTripsTheUsername() {
        JwtService service = jwtService(SECRET, 60_000);

        String token = service.generateToken("alice");

        assertThat(service.extractSubject(token)).isEqualTo("alice");
    }

    @Test
    void extractSubject_throwsOnMalformedToken() {
        JwtService service = jwtService(SECRET, 60_000);

        assertThatThrownBy(() -> service.extractSubject("not-a-jwt"))
                .isInstanceOf(JwtException.class);
    }

    @Test
    void extractSubject_throwsWhenSignedWithAnotherKey() {
        String foreignToken = jwtService(OTHER_SECRET, 60_000).generateToken("alice");

        assertThatThrownBy(() -> jwtService(SECRET, 60_000).extractSubject(foreignToken))
                .isInstanceOf(JwtException.class);
    }

    @Test
    void extractSubject_throwsWhenTokenIsExpired() {
        JwtService service = jwtService(SECRET, -1_000);
        String expired = service.generateToken("alice");

        assertThatThrownBy(() -> service.extractSubject(expired))
                .isInstanceOf(ExpiredJwtException.class);
    }
}
