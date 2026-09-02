package com.orion.mdd.auth;

import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.orion.mdd.auth.exceptions.EmailAlreadyUsedException;
import com.orion.mdd.auth.exceptions.InvalidCredentialsException;
import com.orion.mdd.auth.exceptions.UsernameAlreadyUsedException;
import com.orion.mdd.auth.security.JwtService;
import com.orion.mdd.users.User;
import com.orion.mdd.users.UserService;

@Service
class AuthServiceImpl implements AuthService {

    private final UserService userService;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;
    private final AuthenticationManager authenticationManager;

    AuthServiceImpl(UserService userService, PasswordEncoder passwordEncoder, JwtService jwtService,
            AuthenticationManager authenticationManager) {
        this.userService = userService;
        this.passwordEncoder = passwordEncoder;
        this.jwtService = jwtService;
        this.authenticationManager = authenticationManager;
    }

    @Override
    @Transactional
    public String register(String email, String username, String rawPassword) {
        if (userService.existsByEmail(email)) {
            throw new EmailAlreadyUsedException();
        }
        if (userService.existsByUsername(username)) {
            throw new UsernameAlreadyUsedException();
        }

        User user = userService.create(new User(email, username, passwordEncoder.encode(rawPassword)));

        return jwtService.generateToken(user.getUsername());
    }

    @Override
    public String login(String emailOrUsername, String rawPassword) {
        try {
            Authentication authentication = authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(emailOrUsername, rawPassword));

            UserDetails principal = (UserDetails) authentication.getPrincipal();
            return jwtService.generateToken(principal.getUsername());
        } catch (AuthenticationException _) {
            throw new InvalidCredentialsException();
        }
    }

    @Override
    @Transactional(readOnly = true)
    public User me(Long userId) {
        return userService.loadById(userId);
    }

}
