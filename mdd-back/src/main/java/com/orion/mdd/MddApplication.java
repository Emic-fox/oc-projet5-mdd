package com.orion.mdd;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.context.properties.ConfigurationPropertiesScan;

/**
 * Point d'entrée de l'application Spring Boot MDD (Monde de Dév).
 */
@SpringBootApplication
@ConfigurationPropertiesScan
public class MddApplication {

	/**
	 * Démarre le contexte Spring Boot de l'application.
	 *
	 * @param args arguments de la ligne de commande
	 */
	public static void main(String[] args) {
		SpringApplication.run(MddApplication.class, args);
	}

}
