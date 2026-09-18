package com.orion.mdd.users;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

/**
 * Accès aux données des utilisateurs.
 */
interface UserRepository extends JpaRepository<User, Long> {

    /**
     * @param emailOrUsername email ou nom d'utilisateur recherché
     * @return l'utilisateur correspondant, s'il existe
     */
    @Query("SELECT u FROM User u WHERE u.email = :emailOrUsername OR u.username = :emailOrUsername")
    Optional<User> findByEmailOrUsername(@Param("emailOrUsername") String emailOrUsername);

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
    boolean existsByEmailAndIdNot(String email, Long id);

    /**
     * @param username nom d'utilisateur recherché
     * @param id identifiant à exclure de la recherche
     * @return {@code true} si un utilisateur autre que {@code id} possède ce nom d'utilisateur
     */
    boolean existsByUsernameAndIdNot(String username, Long id);

}
