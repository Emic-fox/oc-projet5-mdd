package com.orion.mdd.users;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;

import jakarta.persistence.PersistenceException;
import jakarta.validation.ConstraintViolationException;

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

@DataJpaTest
@AutoConfigureTestDatabase(replace = AutoConfigureTestDatabase.Replace.NONE)
@ActiveProfiles("test")
@Testcontainers
@Tag("integration")
@Tag("persistence")
@DisplayName("UserRepository (JPA + MariaDB)")
class UserRepositoryTest {

    @Container
    @ServiceConnection
    static final MariaDBContainer<?> mariadb = new MariaDBContainer<>("mariadb:12.3");

    @Autowired
    private UserRepository repository;

    @Autowired
    private TestEntityManager em;

    private User alice;

    @BeforeEach
    void setUp() {
        alice = em.persistFlushFind(new User("alice@mdd.com", "alice", "secret"));
        em.persistFlushFind(new User("bob@mdd.com", "bob", "secret"));
    }

    @Test
    @DisplayName("findByEmailOrUsername trouve l'utilisateur par email")
    void findByEmailOrUsername_matchesOnEmail() {
        assertThat(repository.findByEmailOrUsername("alice@mdd.com"))
                .contains(alice);
    }

    @Test
    @DisplayName("findByEmailOrUsername trouve l'utilisateur par username")
    void findByEmailOrUsername_matchesOnUsername() {
        assertThat(repository.findByEmailOrUsername("alice"))
                .contains(alice);
    }

    @Test
    @DisplayName("findByEmailOrUsername renvoie vide quand rien ne correspond")
    void findByEmailOrUsername_returnsEmptyWhenNoMatch() {
        assertThat(repository.findByEmailOrUsername("nobody"))
                .isEmpty();
    }

    @Test
    @DisplayName("le username ne peut pas contenir de @")
    void usernameCannotContainAnAtSign() {
        var invalid = new User("carol@mdd.com", "bob@mdd.com", "secret");
        assertThatThrownBy(() -> em.persistAndFlush(invalid))
                .isInstanceOf(ConstraintViolationException.class);
    }

    @Test
    @DisplayName("l'email doit contenir un @")
    void emailMustContainAnAtSign() {
        var invalid = new User("carol", "carol", "secret");
        assertThatThrownBy(() -> em.persistAndFlush(invalid))
                .isInstanceOf(ConstraintViolationException.class);
    }

    @Test
    @DisplayName("l'email doit être unique en base")
    void emailMustBeUnique() {
        var duplicate = new User("alice@mdd.com", "other", "secret");
        assertThatThrownBy(() -> em.persistAndFlush(duplicate))
                .isInstanceOf(PersistenceException.class);
    }
}
