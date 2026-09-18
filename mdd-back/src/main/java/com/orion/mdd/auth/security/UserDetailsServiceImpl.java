package com.orion.mdd.auth.security;

import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import com.orion.mdd.users.User;
import com.orion.mdd.users.UserService;
import com.orion.mdd.users.exceptions.UserNotFoundException;

/**
 * Pont entre Spring Security et le domaine {@code users} : charge un utilisateur
 * à partir de son email ou de son username (le sujet porté par le JWT).
 */
@Service
class UserDetailsServiceImpl implements UserDetailsService {

    private final UserService userService;

    /** @param userService service de persistance des utilisateurs */
    UserDetailsServiceImpl(UserService userService) {
        this.userService = userService;
    }

    /** Charge l'utilisateur par email ou username ; lève {@link UsernameNotFoundException} si introuvable. */
    @Override
    public UserDetails loadUserByUsername(String emailOrUsername) throws UsernameNotFoundException {
        try {
            User user = userService.loadUserByEmailOrUsername(emailOrUsername);
            return UserDetailsImpl.fromUser(user);
        } catch (UserNotFoundException e) {
            throw new UsernameNotFoundException(emailOrUsername, e);
        }
    }
}
