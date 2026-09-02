package com.orion.mdd;

import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Tag;
import org.junit.jupiter.api.Test;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.testcontainers.service.connection.ServiceConnection;
import org.springframework.test.context.ActiveProfiles;
import org.testcontainers.containers.MariaDBContainer;
import org.testcontainers.junit.jupiter.Container;
import org.testcontainers.junit.jupiter.Testcontainers;

@SpringBootTest
@ActiveProfiles("test")
@Testcontainers
@Tag("integration")
@Tag("bootstrap")
@DisplayName("MddApplication")
class MddApplicationTests {

	@Container
	@ServiceConnection
	static final MariaDBContainer<?> mariadb = new MariaDBContainer<>("mariadb:12.3");

	@Test
	@DisplayName("le contexte Spring démarre")
	void contextLoads() {
	}

}
