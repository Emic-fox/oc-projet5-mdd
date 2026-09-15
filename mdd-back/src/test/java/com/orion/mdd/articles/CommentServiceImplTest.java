package com.orion.mdd.articles;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import java.util.List;

import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Tag;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.data.domain.Sort;

import com.orion.mdd.articles.exceptions.ArticleNotFoundException;
import com.orion.mdd.topics.Topic;
import com.orion.mdd.users.User;
import com.orion.mdd.users.UserService;

@ExtendWith(MockitoExtension.class)
@Tag("unit")
@Tag("service")
@DisplayName("CommentServiceImpl")
class CommentServiceImplTest {

    @Mock
    private CommentRepository commentRepository;

    @Mock
    private ArticleService articleService;

    @Mock
    private UserService userService;

    @InjectMocks
    private CommentServiceImpl service;

    private static User userWithId(long id) {
        User user = new User("user" + id + "@mdd.com", "user" + id, "secret");
        user.setId(id);
        return user;
    }

    private static Article articleWithId(long id) {
        Topic topic = new Topic("Java", "Description Java");
        topic.setId(1L);

        Article article = new Article("Titre", "Contenu", topic, userWithId(1L));
        article.setId(id);
        return article;
    }

    private static Comment commentWithId(long id, Article article, User author) {
        Comment comment = new Comment("Commentaire", article, author);
        comment.setId(id);
        return comment;
    }

    @Test
    @DisplayName("getByArticleId vérifie l'existence de l'article puis interroge le repository trié par date de création croissante")
    void getByArticleId_articleExists_queriesRepositoryWithAscendingSort() {
        Article article = articleWithId(1L);
        when(articleService.getById(1L)).thenReturn(article);
        when(commentRepository.findByArticleIdWithAuthor(eq(1L), any())).thenReturn(List.of());

        service.getByArticleId(1L);

        verify(commentRepository).findByArticleIdWithAuthor(eq(1L), eq(Sort.by(Sort.Direction.ASC, "createdAt")));
    }

    @Test
    @DisplayName("getByArticleId renvoie les commentaires renvoyés par le repository")
    void getByArticleId_returnsCommentsFromRepository() {
        Article article = articleWithId(1L);
        User author = userWithId(1L);
        Comment comment = commentWithId(1L, article, author);
        when(articleService.getById(1L)).thenReturn(article);
        when(commentRepository.findByArticleIdWithAuthor(eq(1L), any())).thenReturn(List.of(comment));

        List<Comment> result = service.getByArticleId(1L);

        assertThat(result).containsExactly(comment);
    }

    @Test
    @DisplayName("getByArticleId lève ArticleNotFoundException quand l'article n'existe pas")
    void getByArticleId_throwsArticleNotFoundExceptionWhenArticleDoesNotExist() {
        when(articleService.getById(1L)).thenThrow(new ArticleNotFoundException());

        assertThatThrownBy(() -> service.getByArticleId(1L))
            .isInstanceOf(ArticleNotFoundException.class);

        verify(commentRepository, never()).findByArticleIdWithAuthor(any(), any());
    }

    @Test
    @DisplayName("create sauvegarde un commentaire avec l'article et l'auteur résolus")
    void create_savesCommentWithResolvedArticleAndAuthor() {
        Article article = articleWithId(1L);
        User author = userWithId(42L);
        when(articleService.getById(1L)).thenReturn(article);
        when(userService.loadById(42L)).thenReturn(author);
        when(commentRepository.save(any(Comment.class))).thenAnswer(invocation -> invocation.getArgument(0));

        Comment result = service.create(1L, 42L, "Commentaire");

        assertThat(result.getContent()).isEqualTo("Commentaire");
        assertThat(result.getArticle()).isEqualTo(article);
        assertThat(result.getAuthor()).isEqualTo(author);
    }

    @Test
    @DisplayName("create lève ArticleNotFoundException quand l'article n'existe pas")
    void create_throwsArticleNotFoundExceptionWhenArticleDoesNotExist() {
        when(articleService.getById(1L)).thenThrow(new ArticleNotFoundException());

        assertThatThrownBy(() -> service.create(1L, 42L, "Commentaire"))
            .isInstanceOf(ArticleNotFoundException.class);

        verify(commentRepository, never()).save(any());
    }
}
