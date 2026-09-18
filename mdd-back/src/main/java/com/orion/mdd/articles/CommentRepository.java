package com.orion.mdd.articles;

import java.util.List;

import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

/**
 * Repository Spring Data JPA d'accès aux {@link Comment}.
 */
interface CommentRepository extends JpaRepository<Comment, Long> {
    /**
     * Récupère les commentaires d'un article, avec leur auteur chargé en une seule requête.
     *
     * @param articleId identifiant de l'article
     * @param sort ordre de tri à appliquer
     * @return la liste des commentaires de l'article
     */
    @Query("SELECT c FROM Comment c JOIN FETCH c.author WHERE c.article.id = :articleId")
    List<Comment> findByArticleIdWithAuthor(@Param("articleId") Long articleId, Sort sort);
}
