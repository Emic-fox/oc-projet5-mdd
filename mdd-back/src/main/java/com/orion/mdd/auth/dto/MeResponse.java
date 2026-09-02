package com.orion.mdd.auth.dto;

import java.time.LocalDateTime;

public record MeResponse(
        Long id,
        String email,
        String username,
        LocalDateTime createdAt) {
}
