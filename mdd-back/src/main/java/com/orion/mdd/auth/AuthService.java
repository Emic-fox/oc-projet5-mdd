package com.orion.mdd.auth;

import com.orion.mdd.users.User;

public interface AuthService {

    /** Crée un compte et renvoie un jeton d'authentification. */
    String register(String email, String username, String rawPassword);

    /** Vérifie les identifiants et renvoie un jeton d'authentification. */
    String login(String emailOrUsername, String rawPassword);

    /** Renvoie l'utilisateur identifié par son email ou son username. */
    User me(String emailOrUsername);
}
