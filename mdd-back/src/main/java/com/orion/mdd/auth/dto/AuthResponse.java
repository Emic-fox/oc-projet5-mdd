package com.orion.mdd.auth.dto;

import io.swagger.v3.oas.annotations.media.Schema;

public record AuthResponse(
    @Schema(description = "Token JWT d'authentification", example = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJhbGljZSIsImlhdCI6MTY5MDAwMDAwMCwiZXhwIjoxNjkwMDA2MDAwfQ.abc123def456ghi789jkl012mno345pqr678stu901vwx234yz567890")
    String token
) {
}
