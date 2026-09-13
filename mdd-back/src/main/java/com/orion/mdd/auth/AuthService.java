package com.orion.mdd.auth;

import com.orion.mdd.users.User;

public interface AuthService {

    /** Crée un compte et renvoie un jeton d'authentification. */
    String register(String email, String username, String rawPassword);

    /** Vérifie les identifiants et renvoie un jeton d'authentification. */
    String login(String emailOrUsername, String rawPassword);

    /** Renvoie l'utilisateur authentifié à partir de son identifiant. */
    User me(Long userId);

    /** Met à jour l'email et le nom d'utilisateur du profil et renvoie l'utilisateur à jour. */
    User updateMe(Long userId, String email, String username);

    /** Change le mot de passe de l'utilisateur. */
    void updatePassword(Long userId, String rawPassword);
}
