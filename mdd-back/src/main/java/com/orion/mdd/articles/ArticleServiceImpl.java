package com.orion.mdd.articles;

import java.util.List;

import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.orion.mdd.articles.exceptions.ArticleNotFoundException;

@Service
class ArticleServiceImpl implements ArticleService {
    private final ArticleRepository articleRepository;

    ArticleServiceImpl(ArticleRepository articleRepository) {
        this.articleRepository = articleRepository;
    }

    @Override
    @Transactional(readOnly = true)
    public List<Article> getFeed(Long currentUserId, boolean ascending) {
        Sort sort = Sort.by(ascending ? Sort.Direction.ASC : Sort.Direction.DESC, "createdAt");

        return articleRepository.findByTopicSubscribersId(currentUserId, sort);
    }

    @Override
    @Transactional(readOnly = true)
    public Article getById(Long id) {
        return articleRepository.findByIdWithTopicAndAuthor(id)
            .orElseThrow(ArticleNotFoundException::new);
    }
}
