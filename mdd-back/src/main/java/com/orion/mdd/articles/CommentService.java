package com.orion.mdd.articles;

import java.util.List;

/**
 * Service métier de gestion des commentaires.
 */
public interface CommentService {
    /**
     * Récupère les commentaires d'un article.
     *
     * @param articleId identifiant de l'article
     * @return la liste des commentaires de l'article
     * @throws com.orion.mdd.articles.exceptions.ArticleNotFoundException si l'article n'existe pas
     */
    List<Comment> getByArticleId(Long articleId);

    /**
     * Crée un commentaire sur l'article donné, avec l'utilisateur donné comme auteur.
     *
     * @param articleId identifiant de l'article commenté
     * @param authorId identifiant de l'utilisateur auteur
     * @param content contenu du commentaire
     * @return le commentaire créé
     */
    Comment create(Long articleId, Long authorId, String content);
}
