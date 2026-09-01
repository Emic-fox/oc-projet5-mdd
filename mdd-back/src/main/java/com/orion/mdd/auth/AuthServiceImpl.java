package com.orion.mdd.auth;

import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.orion.mdd.auth.exceptions.EmailAlreadyUsedException;
import com.orion.mdd.auth.exceptions.InvalidCredentialsException;
import com.orion.mdd.auth.exceptions.UsernameAlreadyUsedException;
import com.orion.mdd.auth.security.JwtService;
import com.orion.mdd.users.User;
import com.orion.mdd.users.UserNotFoundException;
import com.orion.mdd.users.UserService;

@Service
class AuthServiceImpl implements AuthService {

    private final UserService userService;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;

    AuthServiceImpl(UserService userService, PasswordEncoder passwordEncoder, JwtService jwtService) {
        this.userService = userService;
        this.passwordEncoder = passwordEncoder;
        this.jwtService = jwtService;
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
        User user;
        try {
            user = userService.loadUserByEmailOrUsername(emailOrUsername);
        } catch (UserNotFoundException _) {
            throw new InvalidCredentialsException();
        }

        if (!passwordEncoder.matches(rawPassword, user.getPassword())) {
            throw new InvalidCredentialsException();
        }

        return jwtService.generateToken(user.getUsername());
    }

    @Override
    @Transactional(readOnly = true)
    public User me(String emailOrUsername) {
        return userService.loadUserByEmailOrUsername(emailOrUsername);
    }

}
