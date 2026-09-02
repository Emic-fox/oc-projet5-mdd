package com.orion.mdd.auth;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.verifyNoInteractions;
import static org.mockito.Mockito.when;
import static org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.authentication;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import java.time.LocalDateTime;

import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Nested;
import org.junit.jupiter.api.Tag;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.webmvc.test.autoconfigure.WebMvcTest;
import org.springframework.context.annotation.Import;
import org.springframework.http.MediaType;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import org.springframework.test.web.servlet.MockMvc;

import com.orion.mdd.auth.dto.LoginRequest;
import com.orion.mdd.auth.dto.MeResponse;
import com.orion.mdd.auth.dto.MeResponseMapper;
import com.orion.mdd.auth.dto.RegisterRequest;
import com.orion.mdd.auth.exceptions.EmailAlreadyUsedException;
import com.orion.mdd.auth.exceptions.InvalidCredentialsException;
import com.orion.mdd.auth.exceptions.UsernameAlreadyUsedException;
import com.orion.mdd.auth.security.JwtService;
import com.orion.mdd.auth.security.SecurityConfig;
import com.orion.mdd.auth.security.UserDetailsImpl;
import com.orion.mdd.core.exceptions.ApiExceptionHandler;
import com.orion.mdd.users.User;

import tools.jackson.databind.ObjectMapper;

/**
 * Tests de la couche web de {@link AuthController} : routage, (dé)sérialisation JSON avec
 * l'{@code ObjectMapper} de Boot, validation des corps de requête, traduction des
 * {@code ApiException} par {@link ApiExceptionHandler} et vraie chaîne de filtres de sécurité
 * (endpoints publics vs {@code /me} protégé).
 *
 * <p>Tranche {@code @WebMvcTest} : pas de service métier ni de base de données. {@code JwtService}
 * et {@code UserDetailsService} sont mockés uniquement pour satisfaire {@code JwtAuthenticationFilter}.
 */
@WebMvcTest(AuthController.class)
@Import(SecurityConfig.class)
@Tag("integration")
@Tag("controller")
@DisplayName("AuthController (tranche web)")
class AuthControllerTest {

    @Autowired
    private MockMvc mockMvc;
    @Autowired
    private ObjectMapper objectMapper;

    @MockitoBean
    private AuthService authService;
    @MockitoBean
    private MeResponseMapper meResponseMapper;

    // Requis par la chaîne de sécurité montée dans la tranche (JwtAuthenticationFilter).
    @MockitoBean
    private JwtService jwtService;
    @MockitoBean
    private UserDetailsService userDetailsService;

    private String asJson(Object body) {
        return objectMapper.writeValueAsString(body);
    }

    @Nested
    @DisplayName("POST /api/auth/login")
    class Login {

        @Test
        @DisplayName("renvoie 200 et le token JWT quand les identifiants sont valides")
        void returnsTokenWhenCredentialsAreValid() throws Exception {
            when(authService.login("alice@mdd.com", "secret1234")).thenReturn("jwt-token");

            mockMvc.perform(post("/api/auth/login")
                            .contentType(MediaType.APPLICATION_JSON)
                            .content(asJson(new LoginRequest("alice@mdd.com", "secret1234"))))
                    .andExpect(status().isOk())
                    .andExpect(jsonPath("$.token").value("jwt-token"));
        }

        @Test
        @DisplayName("renvoie 400 quand le login est vide (contrainte @NotBlank)")
        void returns400WhenLoginIsBlank() throws Exception {
            mockMvc.perform(post("/api/auth/login")
                            .contentType(MediaType.APPLICATION_JSON)
                            .content(asJson(new LoginRequest("  ", "secret1234"))))
                    .andExpect(status().isBadRequest());

            verifyNoInteractions(authService);
        }

        @Test
        @DisplayName("renvoie 400 quand le champ password est absent du corps")
        void returns400WhenPasswordIsMissing() throws Exception {
            mockMvc.perform(post("/api/auth/login")
                            .contentType(MediaType.APPLICATION_JSON)
                            .content("""
                                    {"login":"alice"}
                                    """))
                    .andExpect(status().isBadRequest());

            verifyNoInteractions(authService);
        }

        @Test
        @DisplayName("renvoie 401 quand le service rejette les identifiants")
        void returns401WhenCredentialsAreInvalid() throws Exception {
            when(authService.login(any(), any())).thenThrow(new InvalidCredentialsException());

            mockMvc.perform(post("/api/auth/login")
                            .contentType(MediaType.APPLICATION_JSON)
                            .content(asJson(new LoginRequest("alice", "wrongpass"))))
                    .andExpect(status().isUnauthorized());
        }
    }

    @Nested
    @DisplayName("POST /api/auth/register")
    class Register {

        private RegisterRequest validRequest() {
            return new RegisterRequest("alice@mdd.com", "alice", "Secret123!");
        }

        @Test
        @DisplayName("renvoie 200 et le token JWT quand le corps est valide")
        void returnsTokenWhenPayloadIsValid() throws Exception {
            when(authService.register("alice@mdd.com", "alice", "Secret123!")).thenReturn("jwt-token");

            mockMvc.perform(post("/api/auth/register")
                            .contentType(MediaType.APPLICATION_JSON)
                            .content(asJson(validRequest())))
                    .andExpect(status().isOk())
                    .andExpect(jsonPath("$.token").value("jwt-token"));
        }

        @Test
        @DisplayName("renvoie 400 quand l'email est mal formé")
        void returns400WhenEmailIsInvalid() throws Exception {
            mockMvc.perform(post("/api/auth/register")
                            .contentType(MediaType.APPLICATION_JSON)
                            .content(asJson(new RegisterRequest("not-an-email", "alice", "Secret123!"))))
                    .andExpect(status().isBadRequest());

            verify(authService, never()).register(any(), any(), any());
        }

        @Test
        @DisplayName("renvoie 400 quand le username est trop court (contrainte @Username)")
        void returns400WhenUsernameIsTooShort() throws Exception {
            mockMvc.perform(post("/api/auth/register")
                            .contentType(MediaType.APPLICATION_JSON)
                            .content(asJson(new RegisterRequest("alice@mdd.com", "al", "Secret123!"))))
                    .andExpect(status().isBadRequest());

            verify(authService, never()).register(any(), any(), any());
        }

        @Test
        @DisplayName("renvoie 400 quand le mot de passe ne respecte pas @StrongPassword")
        void returns400WhenPasswordIsWeak() throws Exception {
            mockMvc.perform(post("/api/auth/register")
                            .contentType(MediaType.APPLICATION_JSON)
                            .content(asJson(new RegisterRequest("alice@mdd.com", "alice", "weak"))))
                    .andExpect(status().isBadRequest());

            verify(authService, never()).register(any(), any(), any());
        }

        @Test
        @DisplayName("renvoie 409 quand l'email est déjà utilisé")
        void returns409WhenEmailAlreadyUsed() throws Exception {
            when(authService.register(any(), any(), any())).thenThrow(new EmailAlreadyUsedException());

            mockMvc.perform(post("/api/auth/register")
                            .contentType(MediaType.APPLICATION_JSON)
                            .content(asJson(validRequest())))
                    .andExpect(status().isConflict());
        }

        @Test
        @DisplayName("renvoie 409 quand le username est déjà utilisé")
        void returns409WhenUsernameAlreadyUsed() throws Exception {
            when(authService.register(any(), any(), any())).thenThrow(new UsernameAlreadyUsedException());

            mockMvc.perform(post("/api/auth/register")
                            .contentType(MediaType.APPLICATION_JSON)
                            .content(asJson(validRequest())))
                    .andExpect(status().isConflict());
        }
    }

    @Nested
    @DisplayName("GET /api/auth/me")
    class Me {

        @Test
        @DisplayName("renvoie 200 et le profil de l'utilisateur authentifié")
        void returnsCurrentUserInformationForAuthenticatedUser() throws Exception {
            User alice = new User("alice@mdd.com", "alice", "hashed");
            alice.setId(42L);
            LocalDateTime createdAt = LocalDateTime.of(2026, 9, 1, 0, 0);

            when(authService.me(42L)).thenReturn(alice);
            when(meResponseMapper.toMeResponse(alice))
                    .thenReturn(new MeResponse(42L, "alice@mdd.com", "alice", createdAt));

            mockMvc.perform(get("/api/auth/me").with(authentication(authFor(alice))))
                    .andExpect(status().isOk())
                    .andExpect(jsonPath("$.id").value(42))
                    .andExpect(jsonPath("$.email").value("alice@mdd.com"))
                    .andExpect(jsonPath("$.username").value("alice"))
                    .andExpect(jsonPath("$.createdAt").value("2026-09-01T00:00:00"));

            verify(authService).me(42L);
        }

        @Test
        @DisplayName("renvoie 401 quand la requête n'est pas authentifiée")
        void returns401WhenNotAuthenticated() throws Exception {
            mockMvc.perform(get("/api/auth/me"))
                    .andExpect(status().isUnauthorized());

            verifyNoInteractions(authService);
        }

        private Authentication authFor(User user) {
            UserDetailsImpl principal = UserDetailsImpl.fromUser(user);
            return new UsernamePasswordAuthenticationToken(principal, null, principal.getAuthorities());
        }
    }
}
