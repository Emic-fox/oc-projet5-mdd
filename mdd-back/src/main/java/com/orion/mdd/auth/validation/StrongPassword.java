package com.orion.mdd.auth.validation;

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
 * Un mot de passe robuste : 8 à 100 caractères, avec au moins un chiffre, une
 * minuscule, une majuscule et un caractère spécial.
 */
@Documented
@Constraint(validatedBy = {})
@Target({ ElementType.FIELD, ElementType.PARAMETER, ElementType.RECORD_COMPONENT })
@Retention(RetentionPolicy.RUNTIME)
@NotBlank
@Size(min = 8, max = 100)
@Pattern(regexp = "\\D*\\d.*", message = "must contain at least one digit")
@Pattern(regexp = "[^a-z]*[a-z].*", message = "must contain at least one lowercase letter")
@Pattern(regexp = "[^A-Z]*[A-Z].*", message = "must contain at least one uppercase letter")
@Pattern(regexp = "[A-Za-z0-9]*[^A-Za-z0-9].*", message = "must contain at least one special character")
public @interface StrongPassword {

    String message() default "invalid password";

    Class<?>[] groups() default {};

    Class<? extends Payload>[] payload() default {};
}
