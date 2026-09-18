package com.orion.mdd.auth;

import java.util.Objects;

import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.orion.mdd.auth.dto.UpdateMeResult;
import com.orion.mdd.auth.exceptions.EmailAlreadyUsedException;
import com.orion.mdd.auth.exceptions.InvalidCredentialsException;
import com.orion.mdd.auth.exceptions.UsernameAlreadyUsedException;
import com.orion.mdd.auth.security.JwtService;
import com.orion.mdd.users.User;
import com.orion.mdd.users.UserService;

/**
 * Implémentation par défaut de {@link AuthService}, s'appuyant sur
 * {@link UserService} pour la persistance des utilisateurs, {@link PasswordEncoder}
 * pour le hachage des mots de passe, {@link JwtService} pour l'émission des jetons
 * et {@link AuthenticationManager} pour la vérification des identifiants.
 */
@Service
class AuthServiceImpl implements AuthService {

    private final UserService userService;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;
    private final AuthenticationManager authenticationManager;

    /**
     * @param userService            service de persistance des utilisateurs
     * @param passwordEncoder        encodeur utilisé pour hacher les mots de passe
     * @param jwtService             service d'émission/validation des jetons JWT
     * @param authenticationManager  gestionnaire d'authentification Spring Security
     */
    AuthServiceImpl(UserService userService, PasswordEncoder passwordEncoder, JwtService jwtService,
            AuthenticationManager authenticationManager) {
        this.userService = userService;
        this.passwordEncoder = passwordEncoder;
        this.jwtService = jwtService;
        this.authenticationManager = authenticationManager;
    }

    /** {@inheritDoc} */
    @Override
    @Transactional
    public String register(String email, String username, String rawPassword) {
        if (userService.existsByEmail(email)) {
            throw new EmailAlreadyUsedException();
        }
        if (userService.existsByUsername(username)) {
            throw new UsernameAlreadyUsedException();
        }

        User user = userService.create(new User(email, username, encodePassword(rawPassword)));

        return jwtService.generateToken(user.getUsername());
    }

    /** {@inheritDoc} */
    @Override
    public String login(String emailOrUsername, String rawPassword) {
        try {
            Authentication authentication = authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(emailOrUsername, rawPassword));

            if (!(authentication.getPrincipal() instanceof UserDetails principal)) {
                throw new InvalidCredentialsException();
            }
            return jwtService.generateToken(principal.getUsername());
        } catch (AuthenticationException _) {
            throw new InvalidCredentialsException();
        }
    }

    /** {@inheritDoc} */
    @Override
    @Transactional(readOnly = true)
    public User me(Long userId) {
        return userService.loadById(userId);
    }

    /** {@inheritDoc} */
    @Override
    @Transactional
    public UpdateMeResult updateMe(Long userId, String email, String username) {
        User user = userService.loadById(userId);

        if (userService.existsByEmailAndNotId(email, userId)) {
            throw new EmailAlreadyUsedException();
        }
        if (userService.existsByUsernameAndNotId(username, userId)) {
            throw new UsernameAlreadyUsedException();
        }

        user.setEmail(email);
        user.setUsername(username);

        User updated = userService.create(user);
        // Le jeton précédent porte l'ancien username en sujet : on en émet un nouveau
        // pour que le client reste authentifié même si le username a changé.
        return new UpdateMeResult(updated, jwtService.generateToken(updated.getUsername()));
    }

    /** {@inheritDoc} */
    @Override
    @Transactional
    public void updatePassword(Long userId, String rawPassword) {
        User user = userService.loadById(userId);
        user.setPassword(encodePassword(rawPassword));
        userService.create(user);
    }

    /** Encode un mot de passe en clair avec {@link #passwordEncoder} ; échoue si l'encodage renvoie {@code null}. */
    private String encodePassword(String rawPassword) {
        return Objects.requireNonNull(passwordEncoder.encode(rawPassword), "L'encodage du mot de passe a échoué");
    }

}
