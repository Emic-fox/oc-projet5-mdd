package com.orion.mdd.auth;

import static org.assertj.core.api.Assertions.assertThat;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Nested;
import org.junit.jupiter.api.Tag;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.testcontainers.service.connection.ServiceConnection;
import org.springframework.boot.webmvc.test.autoconfigure.AutoConfigureMockMvc;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.transaction.annotation.Transactional;
import org.testcontainers.containers.MariaDBContainer;
import org.testcontainers.junit.jupiter.Container;
import org.testcontainers.junit.jupiter.Testcontainers;

import com.jayway.jsonpath.JsonPath;

/**
 * Test d'intégration de bout en bout de l'authentification : vraie {@code SecurityConfig},
 * vrai {@code JwtAuthenticationFilter}, vrai encodage BCrypt et persistance sur une MariaDB
 * fournie par Testcontainers. Complète {@link AuthControllerTest} (tranche web) en vérifiant
 * le câblage que celle-ci ne monte pas.
 */
@SpringBootTest
@AutoConfigureMockMvc
@ActiveProfiles("test")
@Testcontainers
@Transactional
@Tag("integration")
@Tag("controller")
@Tag("security")
@DisplayName("Authentification (intégration bout en bout)")
class AuthIntegrationTest {

    @Container
    @ServiceConnection
    static final MariaDBContainer<?> mariadb = new MariaDBContainer<>("mariadb:12.3");

    @Autowired
    private MockMvc mockMvc;
    @Autowired
    private JdbcTemplate jdbc;
    @Autowired
    private PasswordEncoder passwordEncoder;

    @BeforeEach
    void cleanDatabase() {
        jdbc.execute("DELETE FROM users");
    }

    private String register(String email, String username, String password) throws Exception {
        String body = mockMvc.perform(post("/api/auth/register")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("""
                                {"email":"%s","username":"%s","password":"%s"}
                                """.formatted(email, username, password)))
                .andExpect(status().isOk())
                .andReturn().getResponse().getContentAsString();
        return JsonPath.read(body, "$.token");
    }

    private String login(String login, String password) throws Exception {
        String body = mockMvc.perform(post("/api/auth/login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("""
                                {"login":"%s","password":"%s"}
                                """.formatted(login, password)))
                .andExpect(status().isOk())
                .andReturn().getResponse().getContentAsString();
        return JsonPath.read(body, "$.token");
    }

    @Nested
    @DisplayName("POST /api/auth/register")
    class Register {

        @Test
        @DisplayName("persiste l'utilisateur avec un mot de passe encodé en BCrypt")
        void persistsUserAndEncodesPassword() throws Exception {
            String token = register("alice@mdd.com", "alice", "Password123!");
            assertThat(token).isNotBlank();

            String storedPassword = jdbc.queryForObject(
                    "SELECT password FROM users WHERE email = ?", String.class, "alice@mdd.com");
            assertThat(storedPassword)
                    .isNotEqualTo("Password123!");
            assertThat(passwordEncoder.matches("Password123!", storedPassword)).isTrue();
        }

        @Test
        @DisplayName("renvoie 409 quand l'email est déjà pris")
        void returns409WhenEmailAlreadyUsed() throws Exception {
            register("alice@mdd.com", "alice", "Password123!");

            mockMvc.perform(post("/api/auth/register")
                            .contentType(MediaType.APPLICATION_JSON)
                            .content("""
                                    {"email":"alice@mdd.com","username":"another","password":"Password123!"}
                                    """))
                    .andExpect(status().isConflict());
        }

        @Test
        @DisplayName("renvoie 400 quand le mot de passe est trop faible")
        void returns400WhenPasswordIsWeak() throws Exception {
            mockMvc.perform(post("/api/auth/register")
                            .contentType(MediaType.APPLICATION_JSON)
                            .content("""
                                    {"email":"bob@mdd.com","username":"bob","password":"weak"}
                                    """))
                    .andExpect(status().isBadRequest());
        }
    }

    @Nested
    @DisplayName("POST /api/auth/login puis GET /api/auth/me")
    class LoginAndMe {

        @Test
        @DisplayName("register -> login -> me : le token émis donne accès au profil")
        void registerThenLoginThenMe_roundTrip() throws Exception {
            register("alice@mdd.com", "alice", "Password123!");
            String token = login("alice@mdd.com", "Password123!");

            mockMvc.perform(get("/api/auth/me")
                            .header(HttpHeaders.AUTHORIZATION, "Bearer " + token))
                    .andExpect(status().isOk())
                    .andExpect(jsonPath("$.email").value("alice@mdd.com"))
                    .andExpect(jsonPath("$.username").value("alice"))
                    .andExpect(jsonPath("$.id").isNumber())
                    .andExpect(jsonPath("$.createdAt").isNotEmpty());
        }

        @Test
        @DisplayName("le login accepte aussi le username, pas seulement l'email")
        void loginWorksWithUsername() throws Exception {
            register("alice@mdd.com", "alice", "Password123!");

            assertThat(login("alice", "Password123!")).isNotBlank();
        }

        @Test
        @DisplayName("renvoie 401 quand le mot de passe est incorrect")
        void returns401WhenPasswordIsWrong() throws Exception {
            register("alice@mdd.com", "alice", "Password123!");

            mockMvc.perform(post("/api/auth/login")
                            .contentType(MediaType.APPLICATION_JSON)
                            .content("""
                                    {"login":"alice@mdd.com","password":"WrongPass123!"}
                                    """))
                    .andExpect(status().isUnauthorized());
        }

        @Test
        @DisplayName("renvoie 401 quand l'utilisateur n'existe pas")
        void returns401WhenUserDoesNotExist() throws Exception {
            mockMvc.perform(post("/api/auth/login")
                            .contentType(MediaType.APPLICATION_JSON)
                            .content("""
                                    {"login":"ghost@mdd.com","password":"Password123!"}
                                    """))
                    .andExpect(status().isUnauthorized());
        }
    }

    @Nested
    @DisplayName("GET /api/auth/me (sécurité)")
    class MeSecurity {

        @Test
        @DisplayName("renvoie 401 sans en-tête Authorization")
        void returns401WithoutToken() throws Exception {
            mockMvc.perform(get("/api/auth/me"))
                    .andExpect(status().isUnauthorized());
        }

        @Test
        @DisplayName("renvoie 401 avec un token JWT malformé")
        void returns401WithMalformedToken() throws Exception {
            mockMvc.perform(get("/api/auth/me")
                            .header(HttpHeaders.AUTHORIZATION, "Bearer not-a-real-jwt"))
                    .andExpect(status().isUnauthorized());
        }
    }
}
