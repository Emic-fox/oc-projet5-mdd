package com.orion.mdd.auth.dto;

import com.orion.mdd.auth.validation.StrongPassword;
import com.orion.mdd.users.validation.Username;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;

public record RegisterRequest(
        @NotBlank @Email String email,

        @Username String username,

        @StrongPassword String password) {
}
