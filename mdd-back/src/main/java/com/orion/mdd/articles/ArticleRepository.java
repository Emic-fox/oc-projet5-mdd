package com.orion.mdd.articles;

import java.util.List;
import java.util.Optional;

import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

interface ArticleRepository extends JpaRepository<Article, Long> {
    @Query("SELECT a FROM Article a JOIN FETCH a.topic t JOIN FETCH a.author " +
       "WHERE EXISTS (SELECT 1 FROM Topic t2 JOIN t2.subscribers s WHERE t2 = t AND s.id = :userId)")
    List<Article> findByTopicSubscribersId(@Param("userId") Long userId, Sort sort);


    @Query("SELECT a FROM Article a JOIN FETCH a.topic JOIN FETCH a.author WHERE a.id = :id")
    Optional<Article> findByIdWithTopicAndAuthor(@Param("id") Long id);
}
