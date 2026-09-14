package com.orion.mdd.articles;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import java.util.List;
import java.util.Optional;

import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Tag;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.ArgumentCaptor;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.data.domain.Sort;

import com.orion.mdd.articles.exceptions.ArticleNotFoundException;
import com.orion.mdd.topics.Topic;
import com.orion.mdd.users.User;

@ExtendWith(MockitoExtension.class)
@Tag("unit")
@Tag("service")
@DisplayName("ArticleServiceImpl")
class ArticleServiceImplTest {

    @Mock
    private ArticleRepository articleRepository;

    @InjectMocks
    private ArticleServiceImpl service;

    private static User userWithId(long id) {
        User user = new User("user" + id + "@mdd.com", "user" + id, "secret");
        user.setId(id);
        return user;
    }

    private static Topic topicWithId(long id) {
        Topic topic = new Topic("Java", "Description Java");
        topic.setId(id);
        return topic;
    }

    private static Article articleWithId(long id, Topic topic, User author) {
        Article article = new Article("Titre", "Contenu", topic, author);
        article.setId(id);
        return article;
    }

    @Test
    @DisplayName("getFeed interroge le repository avec l'id de l'utilisateur courant et un tri décroissant par défaut")
    void getFeed_descending_queriesRepositoryWithDescendingSort() {
        when(articleRepository.findByTopicSubscribersId(eq(42L), any())).thenReturn(List.of());

        service.getFeed(42L, false);

        ArgumentCaptor<Sort> sortCaptor = ArgumentCaptor.forClass(Sort.class);
        verify(articleRepository).findByTopicSubscribersId(eq(42L), sortCaptor.capture());
        assertThat(sortCaptor.getValue().getOrderFor("createdAt").getDirection()).isEqualTo(Sort.Direction.DESC);
    }

    @Test
    @DisplayName("getFeed interroge le repository avec un tri croissant quand demandé")
    void getFeed_ascending_queriesRepositoryWithAscendingSort() {
        when(articleRepository.findByTopicSubscribersId(eq(42L), any())).thenReturn(List.of());

        service.getFeed(42L, true);

        ArgumentCaptor<Sort> sortCaptor = ArgumentCaptor.forClass(Sort.class);
        verify(articleRepository).findByTopicSubscribersId(eq(42L), sortCaptor.capture());
        assertThat(sortCaptor.getValue().getOrderFor("createdAt").getDirection()).isEqualTo(Sort.Direction.ASC);
    }

    @Test
    @DisplayName("getFeed renvoie les articles renvoyés par le repository")
    void getFeed_returnsArticlesFromRepository() {
        Topic topic = topicWithId(1L);
        User author = userWithId(1L);
        Article article = articleWithId(1L, topic, author);
        when(articleRepository.findByTopicSubscribersId(eq(42L), any())).thenReturn(List.of(article));

        List<Article> result = service.getFeed(42L, false);

        assertThat(result).containsExactly(article);
    }

    @Test
    @DisplayName("getById renvoie l'article quand il existe")
    void getById_returnsArticleWhenExists() {
        Topic topic = topicWithId(1L);
        User author = userWithId(1L);
        Article article = articleWithId(1L, topic, author);
        when(articleRepository.findByIdWithTopicAndAuthor(1L)).thenReturn(Optional.of(article));

        Article result = service.getById(1L);

        assertThat(result).isEqualTo(article);
    }

    @Test
    @DisplayName("getById lève ArticleNotFoundException quand l'article n'existe pas")
    void getById_throwsArticleNotFoundExceptionWhenNotFound() {
        when(articleRepository.findByIdWithTopicAndAuthor(1L)).thenReturn(Optional.empty());

        assertThatThrownBy(() -> service.getById(1L))
            .isInstanceOf(ArticleNotFoundException.class);
    }
}
