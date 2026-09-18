package com.orion.mdd.articles.dto;

import org.mapstruct.Mapper;

import com.orion.mdd.articles.Comment;

/**
 * Mapper MapStruct de conversion d'un {@link Comment} en DTO de réponse.
 */
@Mapper(componentModel = "spring")
public interface CommentResponseMapper {
    /**
     * Convertit un commentaire en DTO de réponse.
     *
     * @param comment commentaire à convertir
     * @return le DTO de réponse correspondant
     */
    CommentResponse toCommentResponse(Comment comment);

    /**
     * Convertit un commentaire en DTO de réponse de création, incluant une référence à son article.
     *
     * @param comment commentaire à convertir
     * @return le DTO de réponse de création correspondant
     */
    CommentCreatedResponse toCommentCreatedResponse(Comment comment);
}
