package com.orion.mdd.articles;

import java.util.List;

import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.orion.mdd.users.User;
import com.orion.mdd.users.UserService;

@Service
class CommentServiceImpl implements CommentService {
    private final CommentRepository commentRepository;
    private final ArticleService articleService;
    private final UserService userService;

    CommentServiceImpl(CommentRepository commentRepository, ArticleService articleService, UserService userService) {
        this.commentRepository = commentRepository;
        this.articleService = articleService;
        this.userService = userService;
    }

    @Override
    @Transactional(readOnly = true)
    public List<Comment> getByArticleId(Long articleId) {
        articleService.getById(articleId);

        return commentRepository.findByArticleIdWithAuthor(articleId, Sort.by(Sort.Direction.ASC, "createdAt"));
    }

    @Override
    @Transactional
    public Comment create(Long articleId, Long authorId, String content) {
        Article article = articleService.getById(articleId);
        User author = userService.loadById(authorId);

        Comment comment = new Comment(content, article, author);

        return commentRepository.save(comment);
    }
}
