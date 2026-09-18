package com.orion.mdd.articles;

import java.util.List;

/**
 * Service métier de gestion des articles.
 */
public interface ArticleService {
    /**
     * Récupère le fil des articles des thèmes suivis par un utilisateur.
     *
     * @param currentUserId identifiant de l'utilisateur dont on récupère le fil
     * @param ascending {@code true} pour trier par date de création croissante, {@code false} pour décroissante
     * @return la liste des articles du fil
     */
    List<Article> getFeed(Long currentUserId, boolean ascending);

    /**
     * Récupère un article par son identifiant.
     *
     * @param id identifiant de l'article
     * @return l'article correspondant
     * @throws com.orion.mdd.articles.exceptions.ArticleNotFoundException si aucun article ne correspond à l'identifiant
     */
    Article getById(Long id);

    /**
     * Crée un article sur le thème donné, avec l'utilisateur donné comme auteur.
     *
     * @param topicId identifiant du thème de l'article
     * @param authorId identifiant de l'utilisateur auteur
     * @param title titre de l'article
     * @param content contenu de l'article
     * @return l'article créé
     */
    Article create(Long topicId, Long authorId, String title, String content);
}
