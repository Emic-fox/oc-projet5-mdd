package com.orion.mdd.articles.dto;

import org.mapstruct.Mapper;

import com.orion.mdd.articles.Article;

@Mapper(componentModel = "spring")
public interface ArticleResponseMapper {
    ArticleResponse toArticleResponse(Article article);
}
