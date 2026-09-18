package com.orion.mdd.topics;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

/**
 * Accès aux données des thèmes et de leurs souscriptions.
 */
interface TopicRepository extends JpaRepository<Topic, Long> {
    /**
     * @param userId identifiant de l'utilisateur
     * @return les thèmes auxquels l'utilisateur est abonné
     */
    List<Topic> findBySubscribersId(Long userId);

    /**
     * @return tous les thèmes, avec leurs abonnés chargés en une seule requête (fetch join)
     */
    @Query("SELECT DISTINCT t FROM Topic t LEFT JOIN FETCH t.subscribers")
    List<Topic> findAllWithSubscribers();

    /**
     * @param topicId identifiant du thème
     * @param userId identifiant de l'utilisateur
     * @return {@code true} si le thème existe et que l'utilisateur y est abonné
     */
    boolean existsByIdAndSubscribersId(Long topicId, Long userId);

    /**
     * Crée l'abonnement de l'utilisateur au thème donné.
     *
     * @param topicId identifiant du thème
     * @param userId identifiant de l'utilisateur
     */
    @Modifying
    @Query(value = "INSERT INTO subscriptions (topic_id, user_id) VALUES (:topicId, :userId)", nativeQuery = true)
    void insertSubscription(@Param("topicId") Long topicId, @Param("userId") Long userId);

    /**
     * Supprime l'abonnement de l'utilisateur au thème donné.
     *
     * @param topicId identifiant du thème
     * @param userId identifiant de l'utilisateur
     */
    @Modifying
    @Query(value = "DELETE FROM subscriptions WHERE topic_id = :topicId AND user_id = :userId", nativeQuery = true)
    void deleteSubscription(@Param("topicId") Long topicId, @Param("userId") Long userId);
}
