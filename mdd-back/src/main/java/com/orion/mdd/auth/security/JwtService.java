package com.orion.mdd.auth.security;

import com.orion.mdd.users.User;

public interface JwtService {

    /** Génère un jeton signé pour l'utilisateur authentifié. */
    String generateToken(User user);

    /** Renvoie l'identifiant (email ou username) porté par un jeton valide, ou lève une exception si le jeton est invalide/expiré. */
    String extractSubject(String token);
}
