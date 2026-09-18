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

import com.orion.mdd.auth.dto.UpdateMeResult;
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

    @Nested
    @DisplayName("updateMe")
    class UpdateMe {

        @Test
        @DisplayName("met à jour l'email et le username puis renvoie l'utilisateur et un nouveau jeton")
        void updatesEmailAndUsernameAndReturnsUserAndToken() {
            User alice = alice();
            when(userService.loadById(1L)).thenReturn(alice);
            when(userService.existsByEmailAndNotId("alice2@mdd.com", 1L)).thenReturn(false);
            when(userService.existsByUsernameAndNotId("alice2", 1L)).thenReturn(false);
            when(userService.create(alice)).thenReturn(alice);
            when(jwtService.generateToken("alice2")).thenReturn("jwt-token");

            UpdateMeResult result = service.updateMe(1L, "alice2@mdd.com", "alice2");

            assertThat(result.user()).isSameAs(alice);
            assertThat(result.token()).isEqualTo("jwt-token");
            assertThat(alice.getEmail()).isEqualTo("alice2@mdd.com");
            assertThat(alice.getUsername()).isEqualTo("alice2");

            verify(userService).create(alice);
        }

        @Test
        @DisplayName("lève EmailAlreadyUsedException et ne modifie rien quand l'email appartient à un autre compte")
        void throwsWhenEmailAlreadyUsedByAnotherAccount() {
            User alice = alice();
            when(userService.loadById(1L)).thenReturn(alice);
            when(userService.existsByEmailAndNotId("bob@mdd.com", 1L)).thenReturn(true);

            assertThatThrownBy(() -> service.updateMe(1L, "bob@mdd.com", "alice2"))
                    .isInstanceOf(EmailAlreadyUsedException.class);

            assertThat(alice.getEmail()).isEqualTo("alice@mdd.com");
            verify(userService, never()).create(any());
        }

        @Test
        @DisplayName("lève UsernameAlreadyUsedException et ne modifie rien quand le username appartient à un autre compte")
        void throwsWhenUsernameAlreadyUsedByAnotherAccount() {
            User alice = alice();
            when(userService.loadById(1L)).thenReturn(alice);
            when(userService.existsByEmailAndNotId("alice2@mdd.com", 1L)).thenReturn(false);
            when(userService.existsByUsernameAndNotId("bob", 1L)).thenReturn(true);

            assertThatThrownBy(() -> service.updateMe(1L, "alice2@mdd.com", "bob"))
                    .isInstanceOf(UsernameAlreadyUsedException.class);

            assertThat(alice.getUsername()).isEqualTo("alice");
            verify(userService, never()).create(any());
        }
    }

    @Nested
    @DisplayName("updatePassword")
    class UpdatePassword {

        @Test
        @DisplayName("encode le nouveau mot de passe et persiste l'utilisateur")
        void encodesNewPasswordAndPersistsUser() {
            User alice = alice();
            when(userService.loadById(1L)).thenReturn(alice);
            when(passwordEncoder.encode("newSecret1234")).thenReturn("newHashed");

            service.updatePassword(1L, "newSecret1234");

            assertThat(alice.getPassword()).isEqualTo("newHashed");
            verify(userService).create(alice);
        }
    }
}
