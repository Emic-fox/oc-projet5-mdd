package com.orion.mdd.auth.dto;

import com.orion.mdd.users.User;

/**
 * Résultat de la mise à jour du profil : l'utilisateur à jour et un nouveau
 * jeton JWT (le token précédent porte l'ancien username en sujet et devient
 * invalide dès que celui-ci change).
 */
public record UpdateMeResult(User user, String token) {
}
