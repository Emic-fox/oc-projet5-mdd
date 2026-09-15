package com.orion.mdd.articles;

import static org.assertj.core.api.Assertions.assertThat;

import java.util.List;
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
@DisplayName("CommentRepository (JPA + MariaDB)")
class CommentRepositoryTest {

    @Container
    @ServiceConnection
    static final MariaDBContainer<?> mariadb = new MariaDBContainer<>("mariadb:12.3");

    @Autowired
    private CommentRepository repository;

    @Autowired
    private TestEntityManager em;

    private User alice;
    private User bob;
    private Article javaArticle;
    private Article pythonArticle;
    private Comment comment1;
    private Comment comment2;

    @BeforeEach
    void setUp() {
        alice = em.persistFlushFind(new User("alice@mdd.com", "alice", "secret"));
        bob = em.persistFlushFind(new User("bob@mdd.com", "bob", "secret"));

        Topic java = new Topic("Java", "Description Java");
        java.setSubscribers(Set.of(alice));
        java = em.persistFlushFind(java);

        Topic python = new Topic("Python", "Description Python");
        python.setSubscribers(Set.of(bob));
        python = em.persistFlushFind(python);

        javaArticle = em.persistFlushFind(new Article("Titre Java", "Contenu Java", java, alice));
        pythonArticle = em.persistFlushFind(new Article("Titre Python", "Contenu Python", python, bob));

        comment1 = em.persistFlushFind(new Comment("Premier commentaire", javaArticle, alice));
        comment2 = em.persistFlushFind(new Comment("Second commentaire", javaArticle, bob));
        em.persistFlushFind(new Comment("Commentaire sur Python", pythonArticle, bob));

        em.clear();
    }

    @Test
    @DisplayName("findByArticleIdWithAuthor ne renvoie que les commentaires de l'article demandé")
    void findByArticleIdWithAuthor_returnsOnlyCommentsFromRequestedArticle() {
        List<Comment> comments = repository.findByArticleIdWithAuthor(javaArticle.getId(), Sort.by(Sort.Direction.ASC, "createdAt"));

        assertThat(comments).extracting(Comment::getId)
                .containsExactlyInAnyOrder(comment1.getId(), comment2.getId());
    }

    @Test
    @DisplayName("findByArticleIdWithAuthor renvoie une liste vide quand l'article n'a aucun commentaire")
    void findByArticleIdWithAuthor_returnsEmptyWhenArticleHasNoComments() {
        assertThat(repository.findByArticleIdWithAuthor(pythonArticle.getId() + 999, Sort.by(Sort.Direction.ASC, "createdAt"))).isEmpty();
    }

    @Test
    @DisplayName("findByArticleIdWithAuthor charge l'auteur de chaque commentaire")
    void findByArticleIdWithAuthor_loadsCommentAuthor() {
        List<Comment> comments = repository.findByArticleIdWithAuthor(javaArticle.getId(), Sort.by(Sort.Direction.ASC, "createdAt"));

        assertThat(comments).extracting(comment -> comment.getAuthor().getId())
                .containsExactlyInAnyOrder(alice.getId(), bob.getId());
    }
}
