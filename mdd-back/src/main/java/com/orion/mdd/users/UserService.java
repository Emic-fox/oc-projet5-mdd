package com.orion.mdd.users;

/**
 * Service métier des utilisateurs.
 */
public interface UserService {

    /**
     * @param emailOrUsername email ou nom d'utilisateur recherché
     * @return l'utilisateur correspondant
     * @throws com.orion.mdd.users.exceptions.UserNotFoundException si aucun utilisateur ne correspond
     */
    User loadUserByEmailOrUsername(String emailOrUsername);

    /**
     * @param id identifiant de l'utilisateur
     * @return l'utilisateur correspondant
     * @throws com.orion.mdd.users.exceptions.UserNotFoundException si aucun utilisateur ne correspond
     */
    User loadById(Long id);

    /**
     * @param email email recherché
     * @return {@code true} si un utilisateur possède cet email
     */
    boolean existsByEmail(String email);

    /**
     * @param username nom d'utilisateur recherché
     * @return {@code true} si un utilisateur possède ce nom d'utilisateur
     */
    boolean existsByUsername(String username);

    /**
     * @param email email recherché
     * @param id identifiant à exclure de la recherche
     * @return {@code true} si un utilisateur autre que {@code id} possède cet email
     */
    boolean existsByEmailAndNotId(String email, Long id);

    /**
     * @param username nom d'utilisateur recherché
     * @param id identifiant à exclure de la recherche
     * @return {@code true} si un utilisateur autre que {@code id} possède ce nom d'utilisateur
     */
    boolean existsByUsernameAndNotId(String username, Long id);

    /**
     * @param user utilisateur à créer
     * @return l'utilisateur persisté
     */
    User create(User user);
}
