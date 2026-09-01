package com.orion.mdd;

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
class MddApplicationTests {

	@Container
	@ServiceConnection
	static final MariaDBContainer<?> mariadb = new MariaDBContainer<>("mariadb:12.3");

	@Test
	void contextLoads() {
	}

}
