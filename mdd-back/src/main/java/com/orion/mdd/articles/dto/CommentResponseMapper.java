package com.orion.mdd.articles.dto;

import org.mapstruct.Mapper;

import com.orion.mdd.articles.Comment;

@Mapper(componentModel = "spring")
public interface CommentResponseMapper {
    CommentResponse toCommentResponse(Comment comment);

    CommentCreatedResponse toCommentCreatedResponse(Comment comment);
}
