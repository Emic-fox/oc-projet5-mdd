package com.orion.mdd.topics;

import java.util.List;

import com.orion.mdd.topics.dto.TopicWithSubscription;

/**
 * Service métier des thèmes et de leurs souscriptions.
 */
public interface TopicService {
    /**
     * @param currentUserId identifiant de l'utilisateur connecté
     * @param onlySubscribed si {@code true}, ne renvoie que les thèmes souscrits par l'utilisateur
     * @return les thèmes, avec pour chacun l'état de souscription de l'utilisateur
     */
    List<TopicWithSubscription> getAll(Long currentUserId, boolean onlySubscribed);

    /**
     * @param id identifiant du thème
     * @return le thème correspondant
     * @throws com.orion.mdd.topics.exceptions.TopicNotFoundException si aucun thème ne correspond à cet identifiant
     */
    Topic getById(Long id);

    /**
     * Abonne l'utilisateur au thème donné.
     *
     * @param topicId identifiant du thème
     * @param userId identifiant de l'utilisateur
     * @throws com.orion.mdd.topics.exceptions.TopicNotFoundException si le thème n'existe pas
     * @throws com.orion.mdd.topics.exceptions.AlreadySubscribedException si l'utilisateur est déjà abonné
     */
    void subscribe(Long topicId, Long userId);

    /**
     * Désabonne l'utilisateur du thème donné.
     *
     * @param topicId identifiant du thème
     * @param userId identifiant de l'utilisateur
     * @throws com.orion.mdd.topics.exceptions.TopicNotFoundException si le thème n'existe pas
     * @throws com.orion.mdd.topics.exceptions.NotSubscribedException si l'utilisateur n'est pas abonné
     */
    void unsubscribe(Long topicId, Long userId);
}
