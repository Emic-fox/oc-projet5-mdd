package com.orion.mdd.users;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import java.util.Optional;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

@ExtendWith(MockitoExtension.class)
class UserServiceImplTest {

    @Mock
    private UserRepository userRepository;

    @InjectMocks
    private UserServiceImpl service;

    private static User alice() {
        return new User("alice@mdd.com", "alice", "secret");
    }

    @Test
    void loadUserByEmailOrUsername_returnsUserWhenFound() {
        User alice = alice();
        when(userRepository.findByEmailOrUsername(any())).thenReturn(Optional.of(alice));

        assertThat(service.loadUserByEmailOrUsername("alice")).isSameAs(alice);
    }

    @Test
    void loadUserByEmailOrUsername_throwsWhenNotFound() {
        when(userRepository.findByEmailOrUsername(any())).thenReturn(Optional.empty());

        assertThatThrownBy(() -> service.loadUserByEmailOrUsername("ghost"))
                .isInstanceOf(UserNotFoundException.class);
    }

    @Test
    void loadUserByEmailOrUsername_queriesRepositoryWithGivenValue() {
        when(userRepository.findByEmailOrUsername(any())).thenReturn(Optional.of(alice()));

        service.loadUserByEmailOrUsername("alice");

        verify(userRepository).findByEmailOrUsername("alice");
    }
}
