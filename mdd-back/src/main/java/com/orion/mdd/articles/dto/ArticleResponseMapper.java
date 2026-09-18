package com.orion.mdd.articles.dto;

import org.mapstruct.Mapper;

import com.orion.mdd.articles.Article;

/**
 * Mapper MapStruct de conversion d'un {@link Article} en {@link ArticleResponse}.
 */
@Mapper(componentModel = "spring")
public interface ArticleResponseMapper {
    /**
     * Convertit un article en DTO de réponse.
     *
     * @param article article à convertir
     * @return le DTO de réponse correspondant
     */
    ArticleResponse toArticleResponse(Article article);
}
