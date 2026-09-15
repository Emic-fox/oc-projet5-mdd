package com.orion.mdd.articles;

import java.util.List;

public interface CommentService {
    List<Comment> getByArticleId(Long articleId);

    Comment create(Long articleId, Long authorId, String content);
}
