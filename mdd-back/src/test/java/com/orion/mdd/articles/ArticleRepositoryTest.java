package com.orion.mdd.articles;

import static org.assertj.core.api.Assertions.assertThat;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.Set;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Tag;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.data.jpa.test.autoconfigure.DataJpaTest;
import org.springframework.boot.jdbc.test.autoconfigure.AutoConfigureTestDatabase;
import org.springframework.boot.jpa.test.autoconfigure.TestEntityManager;
import org.springframework.boot.testcontainers.service.connection.ServiceConnection;
import org.springframework.data.domain.Sort;
import org.springframework.test.context.ActiveProfiles;
import org.testcontainers.containers.MariaDBContainer;
import org.testcontainers.junit.jupiter.Container;
import org.testcontainers.junit.jupiter.Testcontainers;

import com.orion.mdd.topics.Topic;
import com.orion.mdd.users.User;

@DataJpaTest
@AutoConfigureTestDatabase(replace = AutoConfigureTestDatabase.Replace.NONE)
@ActiveProfiles("test")
@Testcontainers
@Tag("integration")
@Tag("persistence")
@DisplayName("ArticleRepository (JPA + MariaDB)")
class ArticleRepositoryTest {

    @Container
    @ServiceConnection
    static final MariaDBContainer<?> mariadb = new MariaDBContainer<>("mariadb:12.3");

    @Autowired
    private ArticleRepository repository;

    @Autowired
    private TestEntityManager em;

    private User alice;
    private User bob;
    private Topic java;
    private Article javaArticle1;
    private Article javaArticle2;

    @BeforeEach
    void setUp() {
        alice = em.persistFlushFind(new User("alice@mdd.com", "alice", "secret"));
        bob = em.persistFlushFind(new User("bob@mdd.com", "bob", "secret"));

        java = new Topic("Java", "Description Java");
        java.setSubscribers(Set.of(alice));
        java = em.persistFlushFind(java);

        Topic python = new Topic("Python", "Description Python");
        python.setSubscribers(Set.of(bob));
        python = em.persistFlushFind(python);

        javaArticle1 = em.persistFlushFind(new Article("Titre Java 1", "Contenu Java 1", java, alice));
        javaArticle2 = em.persistFlushFind(new Article("Titre Java 2", "Contenu Java 2", java, bob));
        em.persistFlushFind(new Article("Titre Python", "Contenu Python", python, bob));

        em.clear();
    }

    @Test
    @DisplayName("findByTopicSubscribersId ne renvoie que les articles des topics souscrits par l'utilisateur")
    void findByTopicSubscribersId_returnsOnlyArticlesFromSubscribedTopics() {
        List<Article> articles = repository.findByTopicSubscribersId(alice.getId(), Sort.by(Sort.Direction.DESC, "createdAt"));

        assertThat(articles).extracting(Article::getId)
                .containsExactlyInAnyOrder(javaArticle1.getId(), javaArticle2.getId());
    }

    @Test
    @DisplayName("findByTopicSubscribersId renvoie une liste vide quand l'utilisateur n'est abonné à aucun topic")
    void findByTopicSubscribersId_returnsEmptyWhenUserHasNoSubscription() {
        User carol = em.persistFlushFind(new User("carol@mdd.com", "carol", "secret"));

        assertThat(repository.findByTopicSubscribersId(carol.getId(), Sort.by(Sort.Direction.DESC, "createdAt"))).isEmpty();
    }

    @Test
    @DisplayName("findByTopicSubscribersId trie par date de création selon le Sort fourni")
    void findByTopicSubscribersId_sortsByCreatedAt() {
        em.getEntityManager()
                .createNativeQuery("UPDATE articles SET created_at = ?1 WHERE id = ?2")
                .setParameter(1, LocalDateTime.now().minusDays(1))
                .setParameter(2, javaArticle1.getId())
                .executeUpdate();
        em.getEntityManager()
                .createNativeQuery("UPDATE articles SET created_at = ?1 WHERE id = ?2")
                .setParameter(1, LocalDateTime.now())
                .setParameter(2, javaArticle2.getId())
                .executeUpdate();
        em.clear();

        List<Article> ascending = repository.findByTopicSubscribersId(alice.getId(), Sort.by(Sort.Direction.ASC, "createdAt"));
        List<Article> descending = repository.findByTopicSubscribersId(alice.getId(), Sort.by(Sort.Direction.DESC, "createdAt"));

        assertThat(ascending).extracting(Article::getId)
                .containsExactly(javaArticle1.getId(), javaArticle2.getId());
        assertThat(descending).extracting(Article::getId)
                .containsExactly(javaArticle2.getId(), javaArticle1.getId());
    }

    @Test
    @DisplayName("findByIdWithTopicAndAuthor renvoie l'article avec son topic et son auteur chargés")
    void findByIdWithTopicAndAuthor_returnsArticleWithTopicAndAuthorLoaded() {
        Optional<Article> found = repository.findByIdWithTopicAndAuthor(javaArticle1.getId());

        assertThat(found).isPresent();
        assertThat(found.get().getTopic().getId()).isEqualTo(java.getId());
        assertThat(found.get().getAuthor().getId()).isEqualTo(alice.getId());
    }

    @Test
    @DisplayName("findByIdWithTopicAndAuthor renvoie vide quand l'article n'existe pas")
    void findByIdWithTopicAndAuthor_returnsEmptyWhenArticleDoesNotExist() {
        assertThat(repository.findByIdWithTopicAndAuthor(999L)).isEmpty();
    }
}
