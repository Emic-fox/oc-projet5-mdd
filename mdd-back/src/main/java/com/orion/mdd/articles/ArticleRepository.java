package com.orion.mdd.articles;

import java.util.List;
import java.util.Optional;

import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

/**
 * Repository Spring Data JPA d'accès aux {@link Article}.
 */
interface ArticleRepository extends JpaRepository<Article, Long> {
    /**
     * Récupère les articles des thèmes auxquels l'utilisateur donné est abonné,
     * avec le thème et l'auteur chargés en une seule requête.
     *
     * @param userId identifiant de l'utilisateur abonné
     * @param sort ordre de tri à appliquer
     * @return la liste des articles correspondants
     */
    @Query("SELECT a FROM Article a JOIN FETCH a.topic t JOIN FETCH a.author " +
       "WHERE EXISTS (SELECT 1 FROM Topic t2 JOIN t2.subscribers s WHERE t2 = t AND s.id = :userId)")
    List<Article> findByTopicSubscribersId(@Param("userId") Long userId, Sort sort);


    /**
     * Récupère un article par son identifiant, avec son thème et son auteur chargés
     * en une seule requête.
     *
     * @param id identifiant de l'article
     * @return l'article correspondant, ou vide si aucun n'existe
     */
    @Query("SELECT a FROM Article a JOIN FETCH a.topic JOIN FETCH a.author WHERE a.id = :id")
    Optional<Article> findByIdWithTopicAndAuthor(@Param("id") Long id);
}
