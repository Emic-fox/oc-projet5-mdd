package com.orion.mdd.auth.dto;

import io.swagger.v3.oas.annotations.media.Schema;

public record MeUpdateResponse(
        @Schema(description = "Profil mis à jour")
        MeResponse user,

        @Schema(description = "Nouveau jeton JWT d'authentification", example = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJhbGljZTIiLCJpYXQiOjE2OTAwMDAwMDAsImV4cCI6MTY5MDAwNjAwMH0.abc123def456ghi789jkl012mno345pqr678stu901vwx234yz567890")
        String token
) {
}
