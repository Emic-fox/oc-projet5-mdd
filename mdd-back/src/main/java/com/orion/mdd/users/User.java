package com.orion.mdd.users;

import java.time.LocalDateTime;

import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EntityListeners;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.NonNull;
import lombok.RequiredArgsConstructor;

@Entity
@Table(name = "users")
@EntityListeners(AuditingEntityListener.class)
@Data
@NoArgsConstructor
@RequiredArgsConstructor
@AllArgsConstructor
public class User {
    @Id
    @GeneratedValue(strategy = jakarta.persistence.GenerationType.IDENTITY)
    private Long id;

    @NonNull
    @Email
    @Column(nullable = false, unique = true)
    private String email;

    @NonNull
    @Size(min = 3, max = 50)
    // Ne jamais autoriser "@" dans le username, pour éviter tout doublon possible avec l'email
    @Pattern(regexp = "^[a-zA-Z0-9._-]+$",
            message = "must contain only letters, digits, dots, underscores or hyphens")
    @Column(nullable = false, unique = true)
    private String username;

    @NonNull
    @Column(nullable = false)
    private String password;

    @CreatedDate
    @Column(updatable = false, columnDefinition="TIMESTAMP DEFAULT CURRENT_TIMESTAMP")
    private LocalDateTime createdAt;
}
