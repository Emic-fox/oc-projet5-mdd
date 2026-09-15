package com.orion.mdd.articles;

import java.util.List;

import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

interface CommentRepository extends JpaRepository<Comment, Long> {
    @Query("SELECT c FROM Comment c JOIN FETCH c.author WHERE c.article.id = :articleId")
    List<Comment> findByArticleIdWithAuthor(@Param("articleId") Long articleId, Sort sort);
}
