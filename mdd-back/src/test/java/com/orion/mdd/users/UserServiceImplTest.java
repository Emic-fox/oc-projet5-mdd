package com.orion.mdd.users;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import java.util.Optional;

import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Tag;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

@ExtendWith(MockitoExtension.class)
@Tag("unit")
@Tag("service")
@DisplayName("UserServiceImpl")
class UserServiceImplTest {

    @Mock
    private UserRepository userRepository;

    @InjectMocks
    private UserServiceImpl service;

    private static User alice() {
        return new User("alice@mdd.com", "alice", "secret");
    }

    @Test
    @DisplayName("loadUserByEmailOrUsername renvoie l'utilisateur quand il existe")
    void loadUserByEmailOrUsername_returnsUserWhenFound() {
        User alice = alice();
        when(userRepository.findByEmailOrUsername(any())).thenReturn(Optional.of(alice));

        assertThat(service.loadUserByEmailOrUsername("alice")).isSameAs(alice);
    }

    @Test
    @DisplayName("loadUserByEmailOrUsername lève UserNotFoundException quand rien ne correspond")
    void loadUserByEmailOrUsername_throwsWhenNotFound() {
        when(userRepository.findByEmailOrUsername(any())).thenReturn(Optional.empty());

        assertThatThrownBy(() -> service.loadUserByEmailOrUsername("ghost"))
                .isInstanceOf(UserNotFoundException.class);
    }

    @Test
    @DisplayName("loadUserByEmailOrUsername interroge le repository avec la valeur fournie")
    void loadUserByEmailOrUsername_queriesRepositoryWithGivenValue() {
        when(userRepository.findByEmailOrUsername(any())).thenReturn(Optional.of(alice()));

        service.loadUserByEmailOrUsername("alice");

        verify(userRepository).findByEmailOrUsername("alice");
    }

    @Test
    @DisplayName("loadById renvoie l'utilisateur quand il existe")
    void loadById_returnsUserWhenFound() {
        User alice = alice();
        when(userRepository.findById(1L)).thenReturn(Optional.of(alice));

        assertThat(service.loadById(1L)).isSameAs(alice);
    }

    @Test
    @DisplayName("loadById lève UserNotFoundException quand l'id est inconnu")
    void loadById_throwsWhenNotFound() {
        when(userRepository.findById(any())).thenReturn(Optional.empty());

        assertThatThrownBy(() -> service.loadById(99L))
                .isInstanceOf(UserNotFoundException.class);
    }
}
