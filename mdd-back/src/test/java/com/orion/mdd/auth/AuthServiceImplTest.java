package com.orion.mdd.auth;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Nested;
import org.junit.jupiter.api.Tag;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.ArgumentCaptor;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.password.PasswordEncoder;

import com.orion.mdd.auth.exceptions.EmailAlreadyUsedException;
import com.orion.mdd.auth.exceptions.InvalidCredentialsException;
import com.orion.mdd.auth.exceptions.UsernameAlreadyUsedException;
import com.orion.mdd.auth.security.JwtService;
import com.orion.mdd.auth.security.UserDetailsImpl;
import com.orion.mdd.users.User;
import com.orion.mdd.users.UserService;

@ExtendWith(MockitoExtension.class)
@Tag("unit")
@Tag("service")
@DisplayName("AuthServiceImpl")
class AuthServiceImplTest {

    @Mock
    private UserService userService;
    @Mock
    private PasswordEncoder passwordEncoder;
    @Mock
    private JwtService jwtService;
    @Mock
    private AuthenticationManager authenticationManager;

    @InjectMocks
    private AuthServiceImpl service;

    private static User alice() {
        User user = new User("alice@mdd.com", "alice", "hashed");
        user.setId(1L);
        return user;
    }

    @Nested
    @DisplayName("register")
    class Register {

        @Test
        @DisplayName("crée l'utilisateur avec un mot de passe encodé et renvoie un token")
        void createsUserWithEncodedPasswordAndReturnsToken() {
            when(userService.existsByEmail("alice@mdd.com")).thenReturn(false);
            when(userService.existsByUsername("alice")).thenReturn(false);
            when(passwordEncoder.encode("secret1234")).thenReturn("hashed");
            when(userService.create(any(User.class))).thenReturn(alice());
            when(jwtService.generateToken("alice")).thenReturn("jwt-token");

            String token = service.register("alice@mdd.com", "alice", "secret1234");

            assertThat(token).isEqualTo("jwt-token");

            ArgumentCaptor<User> captor = ArgumentCaptor.forClass(User.class);
            verify(userService).create(captor.capture());
            assertThat(captor.getValue().getEmail()).isEqualTo("alice@mdd.com");
            assertThat(captor.getValue().getUsername()).isEqualTo("alice");
            assertThat(captor.getValue().getPassword()).isEqualTo("hashed");
        }

        @Test
        @DisplayName("lève EmailAlreadyUsedException et ne crée rien quand l'email existe")
        void throwsWhenEmailAlreadyUsed() {
            when(userService.existsByEmail("alice@mdd.com")).thenReturn(true);

            assertThatThrownBy(() -> service.register("alice@mdd.com", "alice", "secret1234"))
                    .isInstanceOf(EmailAlreadyUsedException.class);

            verify(userService, never()).create(any());
        }

        @Test
        @DisplayName("lève UsernameAlreadyUsedException et ne crée rien quand le username existe")
        void throwsWhenUsernameAlreadyUsed() {
            when(userService.existsByEmail("alice@mdd.com")).thenReturn(false);
            when(userService.existsByUsername("alice")).thenReturn(true);

            assertThatThrownBy(() -> service.register("alice@mdd.com", "alice", "secret1234"))
                    .isInstanceOf(UsernameAlreadyUsedException.class);

            verify(userService, never()).create(any());
        }
    }

    @Nested
    @DisplayName("login")
    class Login {

        @Test
        @DisplayName("renvoie un token pour le principal authentifié")
        void returnsTokenForAuthenticatedPrincipal() {
            UserDetailsImpl principal = UserDetailsImpl.fromUser(alice());
            Authentication authentication = new UsernamePasswordAuthenticationToken(principal, null);
            when(authenticationManager.authenticate(any())).thenReturn(authentication);
            when(jwtService.generateToken("alice")).thenReturn("jwt-token");

            assertThat(service.login("alice", "secret1234")).isEqualTo("jwt-token");
        }

        @Test
        @DisplayName("transmet les identifiants fournis à l'AuthenticationManager")
        void passesGivenCredentialsToAuthenticationManager() {
            UserDetailsImpl principal = UserDetailsImpl.fromUser(alice());
            when(authenticationManager.authenticate(any()))
                    .thenReturn(new UsernamePasswordAuthenticationToken(principal, null));
            when(jwtService.generateToken(any())).thenReturn("jwt-token");

            service.login("alice@mdd.com", "secret1234");

            ArgumentCaptor<UsernamePasswordAuthenticationToken> captor =
                    ArgumentCaptor.forClass(UsernamePasswordAuthenticationToken.class);
            verify(authenticationManager).authenticate(captor.capture());
            assertThat(captor.getValue().getPrincipal()).isEqualTo("alice@mdd.com");
            assertThat(captor.getValue().getCredentials()).isEqualTo("secret1234");
        }

        @Test
        @DisplayName("traduit l'échec d'authentification en InvalidCredentialsException")
        void throwsInvalidCredentialsWhenAuthenticationFails() {
            when(authenticationManager.authenticate(any()))
                    .thenThrow(new BadCredentialsException("bad"));

            assertThatThrownBy(() -> service.login("alice", "wrong"))
                    .isInstanceOf(InvalidCredentialsException.class);
        }
    }

    @Nested
    @DisplayName("me")
    class Me {

        @Test
        @DisplayName("délègue le chargement à UserService")
        void delegatesToUserService() {
            User alice = alice();
            when(userService.loadById(1L)).thenReturn(alice);

            assertThat(service.me(1L)).isSameAs(alice);
        }
    }
}
