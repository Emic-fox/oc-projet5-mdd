package com.orion.mdd.auth.security;

import static org.assertj.core.api.Assertions.assertThat;

import org.junit.jupiter.api.Test;

import com.orion.mdd.users.User;

class UserDetailsImplTest {

    @Test
    void fromUser_copiesEveryField() {
        User alice = new User("alice@mdd.com", "alice", "hashed");
        alice.setId(42L);

        UserDetailsImpl details = UserDetailsImpl.fromUser(alice);

        assertThat(details.getId()).isEqualTo(42L);
        assertThat(details.getEmail()).isEqualTo("alice@mdd.com");
        assertThat(details.getUsername()).isEqualTo("alice");
        assertThat(details.getPassword()).isEqualTo("hashed");
    }

    @Test
    void hasNoAuthorities() {
        UserDetailsImpl details = new UserDetailsImpl(1L, "a@b.com", "a", "p");

        assertThat(details.getAuthorities()).isEmpty();
    }

    @Test
    void accountFlagsDefaultToEnabled() {
        UserDetailsImpl details = new UserDetailsImpl(1L, "a@b.com", "a", "p");

        assertThat(details.isAccountNonExpired()).isTrue();
        assertThat(details.isAccountNonLocked()).isTrue();
        assertThat(details.isCredentialsNonExpired()).isTrue();
        assertThat(details.isEnabled()).isTrue();
    }
}
