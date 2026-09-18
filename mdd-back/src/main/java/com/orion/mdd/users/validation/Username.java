package com.orion.mdd.users.validation;

import java.lang.annotation.Documented;
import java.lang.annotation.ElementType;
import java.lang.annotation.Retention;
import java.lang.annotation.RetentionPolicy;
import java.lang.annotation.Target;

import jakarta.validation.Constraint;
import jakarta.validation.Payload;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;

/**
 * Un identifiant public d'utilisateur : 3 à 50 caractères, uniquement lettres,
 * chiffres, points, underscores ou tirets (jamais de "@", pour éviter toute
 * collision avec une adresse email).
 */
@Documented
@Constraint(validatedBy = {})
@Target({ ElementType.FIELD, ElementType.PARAMETER, ElementType.RECORD_COMPONENT })
@Retention(RetentionPolicy.RUNTIME)
@NotBlank
@Size(min = 3, max = 50)
@Pattern(regexp = "^[a-zA-Z0-9._-]+$",
        message = "must contain only letters, digits, dots, underscores or hyphens")
public @interface Username {

    /** Message d'erreur renvoyé lorsque la contrainte n'est pas respectée. */
    String message() default "invalid username";

    /** Groupes de validation Bean Validation associés à cette contrainte. */
    Class<?>[] groups() default {};

    /** Charge utile associée à cette contrainte, pour les clients de l'API de validation. */
    Class<? extends Payload>[] payload() default {};
}
