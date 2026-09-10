package com.orion.mdd.topics;

import java.util.List;

import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.orion.mdd.auth.security.UserDetailsImpl;
import com.orion.mdd.topics.dto.GetTopicCollectionRequest;
import com.orion.mdd.topics.dto.TopicResponse;
import com.orion.mdd.topics.dto.TopicResponseMapper;
import com.orion.mdd.topics.dto.TopicWithSubscription;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;

@Tag(name = "Thèmes", description = "Opérations contenant les thèmes et leur souscription par l'utilisateur connecté")
@RestController
@RequestMapping(value="/api/topics", produces = MediaType.APPLICATION_JSON_VALUE) 
public class TopicController {
    private final TopicService topicService;
    private final TopicResponseMapper topicResponseMapper;

    public TopicController(TopicService topicService, TopicResponseMapper topicResponseMapper) {
        this.topicService = topicService;
        this.topicResponseMapper = topicResponseMapper;
    }

    @Operation(summary = "Liste des thèmes", description = "Liste des thèmes, avec filtres possible sur les souscriptions actives")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "Liste des thèmes"),
        @ApiResponse(responseCode = "401", description = "Utilisateur non authentifié", content = @Content)
    })
    @SecurityRequirement(name = "bearerAuth")
    @GetMapping("")
    public ResponseEntity<List<TopicResponse>> getTopics(
        @Valid @ModelAttribute GetTopicCollectionRequest request,
        @AuthenticationPrincipal UserDetailsImpl authenticatedUser
    ) {
        List<TopicWithSubscription> topics = topicService.getAll(authenticatedUser.getId(), request.subscribed());
        List<TopicResponse> response = topics.stream()
            .map(topicResponseMapper::toTopicResponse)
            .toList();

        return ResponseEntity.ok(response);
    }
}
