package com.orion.mdd.topics;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.orion.mdd.auth.security.UserDetailsImpl;
import com.orion.mdd.topics.dto.GetTopicCollectionRequest;
import com.orion.mdd.topics.dto.SubscriptionResponse;
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

    @Operation(summary = "Abonnement à un thème", description = "Abonne l'utilisateur connecté au thème donné")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "201", description = "Abonnement créé"),
        @ApiResponse(responseCode = "401", description = "Utilisateur non authentifié", content = @Content),
        @ApiResponse(responseCode = "404", description = "Thème non trouvé", content = @Content),
        @ApiResponse(responseCode = "409", description = "Utilisateur déjà abonné", content = @Content)
    })
    @SecurityRequirement(name = "bearerAuth")
    @PostMapping("/{id}/subscription")
    public ResponseEntity<SubscriptionResponse> subscribe(
        @PathVariable Long id,
        @AuthenticationPrincipal UserDetailsImpl authenticatedUser
    ) {
        topicService.subscribe(id, authenticatedUser.getId());

        SubscriptionResponse response = new SubscriptionResponse(
            new SubscriptionResponse.TopicRef(id),
            new SubscriptionResponse.UserRef(authenticatedUser.getId())
        );

        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @Operation(summary = "Désabonnement à un thème", description = "Désabonne l'utilisateur connecté du thème donné")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "204", description = "Désabonnement effectué"),
        @ApiResponse(responseCode = "401", description = "Utilisateur non authentifié", content = @Content),
        @ApiResponse(responseCode = "404", description = "Thème non trouvé ou utilisateur non abonné", content = @Content)
    })
    @SecurityRequirement(name = "bearerAuth")
    @DeleteMapping("/{id}/subscription")
    public ResponseEntity<Void> unsubscribe(
        @PathVariable Long id,
        @AuthenticationPrincipal UserDetailsImpl authenticatedUser
    ) {
        topicService.unsubscribe(id, authenticatedUser.getId());

        return ResponseEntity.noContent().build();
    }
}
