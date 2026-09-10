package com.orion.mdd.topics;

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
import org.springframework.test.context.ActiveProfiles;
import org.testcontainers.containers.MariaDBContainer;
import org.testcontainers.junit.jupiter.Container;
import org.testcontainers.junit.jupiter.Testcontainers;

import com.orion.mdd.users.User;

@DataJpaTest
@AutoConfigureTestDatabase(replace = AutoConfigureTestDatabase.Replace.NONE)
@ActiveProfiles("test")
@Testcontainers
@Tag("integration")
@Tag("persistence")
@DisplayName("TopicRepository (JPA + MariaDB)")
class TopicRepositoryTest {

    @Container
    @ServiceConnection
    static final MariaDBContainer<?> mariadb = new MariaDBContainer<>("mariadb:12.3");

    @Autowired
    private TopicRepository repository;

    @Autowired
    private TestEntityManager em;

    private User alice;
    private User bob;
    private Topic java;
    private Topic python;
    private Topic rust;

    @BeforeEach
    void setUp() {
        alice = em.persistFlushFind(new User("alice@mdd.com", "alice", "secret"));
        bob = em.persistFlushFind(new User("bob@mdd.com", "bob", "secret"));

        java = new Topic("Java", "Description Java");
        java.setSubscribers(Set.of(alice, bob));
        java = em.persistFlushFind(java);

        python = new Topic("Python", "Description Python");
        python.setSubscribers(Set.of(bob));
        python = em.persistFlushFind(python);

        rust = new Topic("Rust", "Description Rust");
        rust.setSubscribers(Set.of());
        rust = em.persistFlushFind(rust);

        em.clear();
    }

    @Test
    @DisplayName("findBySubscribersId ne renvoie que les topics souscrits par l'utilisateur")
    void findBySubscribersId_returnsOnlyTopicsSubscribedByUser() {
        assertThat(repository.findBySubscribersId(alice.getId()))
                .extracting(Topic::getId)
                .containsExactly(java.getId());
    }

    @Test
    @DisplayName("findBySubscribersId renvoie une liste vide quand l'utilisateur n'est abonné à rien")
    void findBySubscribersId_returnsEmptyWhenUserHasNoSubscription() {
        User carol = em.persistFlushFind(new User("carol@mdd.com", "carol", "secret"));

        assertThat(repository.findBySubscribersId(carol.getId())).isEmpty();
    }

    @Test
    @DisplayName("findAll renvoie tous les topics avec leurs abonnés déjà chargés")
    void findAll_returnsAllTopicsWithSubscribersLoaded() {
        List<Topic> topics = repository.findAll();

        assertThat(topics).extracting(Topic::getId)
                .containsExactlyInAnyOrder(java.getId(), python.getId(), rust.getId());

        Topic reloadedJava = topics.stream().filter(t -> t.getId().equals(java.getId())).findFirst().orElseThrow();
        assertThat(reloadedJava.getSubscribers()).extracting(User::getId)
                .containsExactlyInAnyOrder(alice.getId(), bob.getId());

        Topic reloadedRust = topics.stream().filter(t -> t.getId().equals(rust.getId())).findFirst().orElseThrow();
        assertThat(reloadedRust.getSubscribers()).isEmpty();
    }
}
