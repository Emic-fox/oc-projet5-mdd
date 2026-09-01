package com.orion.mdd.users;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;

import jakarta.persistence.PersistenceException;
import jakarta.validation.ConstraintViolationException;

import org.junit.jupiter.api.BeforeEach;
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
    void findByEmailOrUsername_matchesOnEmail() {
        assertThat(repository.findByEmailOrUsername("alice@mdd.com"))
                .contains(alice);
    }

    @Test
    void findByEmailOrUsername_matchesOnUsername() {
        assertThat(repository.findByEmailOrUsername("alice"))
                .contains(alice);
    }

    @Test
    void findByEmailOrUsername_returnsEmptyWhenNoMatch() {
        assertThat(repository.findByEmailOrUsername("nobody"))
                .isEmpty();
    }

    @Test
    void usernameCannotContainAnAtSign() {
        var invalid = new User("carol@mdd.com", "bob@mdd.com", "secret");
        assertThatThrownBy(() -> em.persistAndFlush(invalid))
                .isInstanceOf(ConstraintViolationException.class);
    }

    @Test
    void emailMustContainAnAtSign() {
        var invalid = new User("carol", "carol", "secret");
        assertThatThrownBy(() -> em.persistAndFlush(invalid))
                .isInstanceOf(ConstraintViolationException.class);
    }

    @Test
    void emailMustBeUnique() {
        var duplicate = new User("alice@mdd.com", "other", "secret");
        assertThatThrownBy(() -> em.persistAndFlush(duplicate))
                .isInstanceOf(PersistenceException.class);
    }
}
