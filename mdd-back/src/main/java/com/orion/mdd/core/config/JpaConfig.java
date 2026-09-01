package com.orion.mdd.core.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.data.jpa.repository.config.EnableJpaAuditing;

/**
 * Active l'audit JPA (@CreatedDate, @LastModifiedDate, ...).
 */
@Configuration
@EnableJpaAuditing
public class JpaConfig {
}
