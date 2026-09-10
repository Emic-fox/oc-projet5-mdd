package com.orion.mdd.topics.dto;

import io.swagger.v3.oas.annotations.media.Schema;

public record TopicResponse(
    @Schema(description = "Identifiant du topic", example = "1")
    Long id,

    @Schema(description = "Nom du topic", example = "Développement")
    String name,
    
    @Schema(description = "Description du topic", example = "Lorem ipsum...")
    String description,
    
    @Schema(description = "L'utilisateur connecté est-il abonné à ce topic ?", example = "true")
    boolean subscribed 
) { }
