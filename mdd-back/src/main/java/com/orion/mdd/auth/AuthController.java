package com.orion.mdd.auth;

import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.orion.mdd.auth.dto.AuthResponse;
import com.orion.mdd.auth.dto.LoginRequest;
import com.orion.mdd.auth.dto.MeResponse;
import com.orion.mdd.auth.dto.MeResponseMapper;
import com.orion.mdd.auth.dto.RegisterRequest;
import com.orion.mdd.auth.security.UserDetailsImpl;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/auth")
public class AuthController {
    private final AuthService authService;
    private final MeResponseMapper meResponseMapper;

    public AuthController(AuthService authService, MeResponseMapper meResponseMapper) {
        this.authService = authService;
        this.meResponseMapper = meResponseMapper;
    }

    @PostMapping("/login")
    public ResponseEntity<AuthResponse> authenticateUser(@Valid @RequestBody LoginRequest loginRequest) {
        String token = this.authService.login(loginRequest.login(), loginRequest.password());

        return ResponseEntity.ok(new AuthResponse(token));
    }

    @PostMapping("/register")
    public ResponseEntity<AuthResponse> registerUser(@Valid @RequestBody RegisterRequest registerRequest) {
        String token = this.authService.register(registerRequest.email(), registerRequest.username(), registerRequest.password());
        return ResponseEntity.ok(new AuthResponse(token));
    }

    @PostMapping("/me")
    public ResponseEntity<MeResponse> currentUser(@AuthenticationPrincipal UserDetailsImpl authenticatedUser) {
        return ResponseEntity.ok(this.meResponseMapper.toMeResponse(this.authService.me(authenticatedUser.getId())));
    }

}
