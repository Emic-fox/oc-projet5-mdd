package com.orion.mdd.articles;

import java.util.List;

import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.orion.mdd.articles.exceptions.ArticleNotFoundException;
import com.orion.mdd.topics.Topic;
import com.orion.mdd.topics.TopicService;
import com.orion.mdd.users.User;
import com.orion.mdd.users.UserService;

@Service
class ArticleServiceImpl implements ArticleService {
    private final ArticleRepository articleRepository;
    private final TopicService topicService;
    private final UserService userService;

    ArticleServiceImpl(ArticleRepository articleRepository, TopicService topicService, UserService userService) {
        this.articleRepository = articleRepository;
        this.topicService = topicService;
        this.userService = userService;
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

    @Override
    @Transactional
    public Article create(Long topicId, Long authorId, String title, String content) {
        Topic topic = topicService.getById(topicId);
        User author = userService.loadById(authorId);

        Article article = new Article(title, content, topic, author);

        return articleRepository.save(article);
    }
}
