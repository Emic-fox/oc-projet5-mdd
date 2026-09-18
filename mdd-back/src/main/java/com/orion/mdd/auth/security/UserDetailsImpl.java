package com.orion.mdd.auth.security;

import java.util.Collection;
import java.util.List;

import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import com.orion.mdd.users.User;

import lombok.AllArgsConstructor;
import lombok.Getter;

/**
 * Adaptation d'un {@link User} au contrat {@link UserDetails} attendu par Spring Security.
 * L'application ne gère pas de rôles : la liste d'autorités est toujours vide.
 */
@Getter
@AllArgsConstructor
public class UserDetailsImpl implements UserDetails {

    private final Long id;
    private final String email;
    private final String username;
    private final String password;

    /**
     * Construit un {@link UserDetailsImpl} à partir d'une entité utilisateur.
     *
     * @param user entité utilisateur source
     * @return les détails d'authentification correspondants
     */
    public static UserDetailsImpl fromUser(User user) {
        return new UserDetailsImpl(user.getId(), user.getEmail(), user.getUsername(), user.getPassword());
    }

    /** Aucun rôle géré par l'application : renvoie toujours une liste vide. */
    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        return List.of();
    }
}
