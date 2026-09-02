package com.orion.mdd.auth.security;

import static org.assertj.core.api.Assertions.assertThat;

import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Tag;
import org.junit.jupiter.api.Test;

import com.orion.mdd.users.User;

@Tag("unit")
@Tag("security")
@DisplayName("UserDetailsImpl")
class UserDetailsImplTest {

    @Test
    @DisplayName("fromUser recopie tous les champs de l'utilisateur")
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
    @DisplayName("n'expose aucune autorité")
    void hasNoAuthorities() {
        UserDetailsImpl details = new UserDetailsImpl(1L, "a@b.com", "a", "p");

        assertThat(details.getAuthorities()).isEmpty();
    }

    @Test
    @DisplayName("les indicateurs de compte sont actifs par défaut")
    void accountFlagsDefaultToEnabled() {
        UserDetailsImpl details = new UserDetailsImpl(1L, "a@b.com", "a", "p");

        assertThat(details.isAccountNonExpired()).isTrue();
        assertThat(details.isAccountNonLocked()).isTrue();
        assertThat(details.isCredentialsNonExpired()).isTrue();
        assertThat(details.isEnabled()).isTrue();
    }
}
