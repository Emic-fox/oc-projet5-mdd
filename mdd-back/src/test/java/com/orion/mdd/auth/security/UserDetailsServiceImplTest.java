package com.orion.mdd.auth.security;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.Mockito.when;

import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Tag;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UsernameNotFoundException;

import com.orion.mdd.users.User;
import com.orion.mdd.users.UserNotFoundException;
import com.orion.mdd.users.UserService;

@ExtendWith(MockitoExtension.class)
@Tag("unit")
@Tag("security")
@DisplayName("UserDetailsServiceImpl")
class UserDetailsServiceImplTest {

    @Mock
    private UserService userService;

    @InjectMocks
    private UserDetailsServiceImpl service;

    @Test
    @DisplayName("loadUserByUsername mappe l'utilisateur du domaine vers UserDetailsImpl")
    void loadUserByUsername_mapsDomainUserToUserDetails() {
        User alice = new User("alice@mdd.com", "alice", "hashed");
        alice.setId(7L);
        when(userService.loadUserByEmailOrUsername("alice")).thenReturn(alice);

        UserDetails details = service.loadUserByUsername("alice");

        assertThat(details.getUsername()).isEqualTo("alice");
        assertThat(details.getPassword()).isEqualTo("hashed");
        assertThat(details).isInstanceOf(UserDetailsImpl.class);
        assertThat(((UserDetailsImpl) details).getEmail()).isEqualTo("alice@mdd.com");
    }

    @Test
    @DisplayName("loadUserByUsername traduit UserNotFoundException en UsernameNotFoundException")
    void loadUserByUsername_translatesUserNotFound() {
        when(userService.loadUserByEmailOrUsername("ghost"))
                .thenThrow(new UserNotFoundException());

        assertThatThrownBy(() -> service.loadUserByUsername("ghost"))
                .isInstanceOf(UsernameNotFoundException.class);
    }
}
