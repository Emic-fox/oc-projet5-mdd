package com.orion.mdd.auth;

import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.orion.mdd.auth.dto.AuthResponse;
import com.orion.mdd.auth.dto.LoginRequest;
import com.orion.mdd.auth.dto.MeResponse;
import com.orion.mdd.auth.dto.MeResponseMapper;
import com.orion.mdd.auth.dto.MeUpdateResponse;
import com.orion.mdd.auth.dto.RegisterRequest;
import com.orion.mdd.auth.dto.UpdateMeRequest;
import com.orion.mdd.auth.dto.UpdatePasswordRequest;
import com.orion.mdd.auth.security.UserDetailsImpl;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;

@Tag(name = "Authentification", description = "Opérations d'authentification des utilisateurs")
@RestController
@RequestMapping(value="/api/auth", produces = MediaType.APPLICATION_JSON_VALUE)
public class AuthController {
    private final AuthService authService;
    private final MeResponseMapper meResponseMapper;

    public AuthController(AuthService authService, MeResponseMapper meResponseMapper) {
        this.authService = authService;
        this.meResponseMapper = meResponseMapper;
    }

    @Operation(summary = "Authentifie un utilisateur et retourne un token JWT", description = "Cette opération permet à un utilisateur de s'authentifier en fournissant son adresse e-mail ou son nom d'utilisateur ainsi que son mot de passe. Si les informations d'identification sont valides, un token JWT est généré et retourné.")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Authentification réussie, token JWT retourné"),
            @ApiResponse(responseCode = "400", description = "Échec de l'authentification, données invalides", content = @Content),
            @ApiResponse(responseCode = "401", description = "Échec de l'authentification, informations d'identification invalides", content = @Content)
    })
    @PostMapping("/login")
    public ResponseEntity<AuthResponse> authenticateUser(@Valid @RequestBody LoginRequest loginRequest) {
        String token = this.authService.login(loginRequest.login(), loginRequest.password());

        return ResponseEntity.ok(new AuthResponse(token));
    }

    @Operation(summary = "Inscrit un nouvel utilisateur et retourne un token JWT", description = "Cette opération permet à un nouvel utilisateur de s'inscrire en fournissant son adresse e-mail, son nom d'utilisateur et son mot de passe. Si les informations fournies sont valides, un compte est créé et un token JWT est généré et retourné.")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "201", description = "Inscription réussie, token JWT retourné"),
            @ApiResponse(responseCode = "400", description = "Échec de l'inscription, données invalides", content = @Content),
            @ApiResponse(responseCode = "409", description = "Échec de l'inscription, username ou email déjà utilisé", content = @Content)
    })
    @PostMapping("/register")
    public ResponseEntity<AuthResponse> registerUser(@Valid @RequestBody RegisterRequest registerRequest) {
        String token = this.authService.register(registerRequest.email(), registerRequest.username(), registerRequest.password());
        return ResponseEntity.status(HttpStatus.CREATED).body(new AuthResponse(token));
    }

    @Operation(summary = "Récupère les informations de l'utilisateur actuellement authentifié", description = "Cette opération permet de récupérer les informations de l'utilisateur actuellement authentifié en utilisant le token JWT fourni dans l'en-tête de la requête. Les informations retournées incluent l'identifiant, l'adresse e-mail, le nom d'utilisateur et la date de création du compte.")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Informations de l'utilisateur récupérées avec succès"),
            @ApiResponse(responseCode = "401", description = "Utilisateur non authentifié", content = @Content)
    })
    @SecurityRequirement(name = "bearerAuth")
    @GetMapping("/me")
    public ResponseEntity<MeResponse> currentUser(@AuthenticationPrincipal UserDetailsImpl authenticatedUser) {
        return ResponseEntity.ok(this.meResponseMapper.toMeResponse(this.authService.me(authenticatedUser.getId())));
    }

    @Operation(summary = "Met à jour le profil de l'utilisateur actuellement authentifié", description = "Cette opération permet à l'utilisateur authentifié de mettre à jour son adresse e-mail et son nom d'utilisateur. Un nouveau jeton JWT est renvoyé : l'ancien porte l'ancien username en sujet et devient invalide si celui-ci a changé.")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Profil mis à jour avec succès, nouveau jeton JWT retourné"),
            @ApiResponse(responseCode = "400", description = "Échec de la mise à jour, données invalides", content = @Content),
            @ApiResponse(responseCode = "401", description = "Utilisateur non authentifié", content = @Content),
            @ApiResponse(responseCode = "409", description = "Échec de la mise à jour, username ou email déjà utilisé", content = @Content)
    })
    @SecurityRequirement(name = "bearerAuth")
    @PutMapping("/me")
    public ResponseEntity<MeUpdateResponse> updateCurrentUser(@AuthenticationPrincipal UserDetailsImpl authenticatedUser,
            @Valid @RequestBody UpdateMeRequest request) {
        UpdateMeResult result = this.authService.updateMe(authenticatedUser.getId(), request.email(), request.username());
        MeResponse me = this.meResponseMapper.toMeResponse(result.user());
        return ResponseEntity.ok(new MeUpdateResponse(me, result.token()));
    }

    @Operation(summary = "Change le mot de passe de l'utilisateur actuellement authentifié", description = "Cette opération permet à l'utilisateur authentifié de changer son mot de passe.")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "204", description = "Mot de passe mis à jour avec succès"),
            @ApiResponse(responseCode = "400", description = "Échec de la mise à jour, mot de passe invalide", content = @Content),
            @ApiResponse(responseCode = "401", description = "Utilisateur non authentifié", content = @Content)
    })
    @SecurityRequirement(name = "bearerAuth")
    @PutMapping("/me/password")
    public ResponseEntity<Void> updateCurrentPassword(@AuthenticationPrincipal UserDetailsImpl authenticatedUser,
            @Valid @RequestBody UpdatePasswordRequest request) {
        this.authService.updatePassword(authenticatedUser.getId(), request.newPassword());
        return ResponseEntity.noContent().build();
    }

}
