package com.orion.mdd.articles;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.orion.mdd.articles.dto.CommentCreatedResponse;
import com.orion.mdd.articles.dto.CommentResponse;
import com.orion.mdd.articles.dto.CommentResponseMapper;
import com.orion.mdd.articles.dto.CreateCommentRequest;
import com.orion.mdd.auth.security.UserDetailsImpl;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;

/**
 * Contrôleur REST exposant les opérations sur les commentaires des articles.
 */
@Tag(name = "Commentaires", description = "Opérations sur les commentaires des articles")
@RestController
@RequestMapping(value = "/api/articles/{id}/comments", produces = MediaType.APPLICATION_JSON_VALUE)
public class CommentController {
    private final CommentService commentService;
    private final CommentResponseMapper commentResponseMapper;

    /**
     * Construit le contrôleur avec ses dépendances injectées par Spring.
     *
     * @param commentService service métier de gestion des commentaires
     * @param commentResponseMapper mapper de conversion des entités {@link Comment} en DTO de réponse
     */
    public CommentController(CommentService commentService, CommentResponseMapper commentResponseMapper) {
        this.commentService = commentService;
        this.commentResponseMapper = commentResponseMapper;
    }

    /**
     * Récupère la liste des commentaires d'un article, triés par date de création.
     *
     * @param id identifiant de l'article
     * @return 200 avec la liste des commentaires de l'article
     */
    @Operation(summary = "Liste des commentaires d'un article", description = "Liste des commentaires d'un article")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "Liste des commentaires"),
        @ApiResponse(responseCode = "401", description = "Utilisateur non authentifié", content = @Content),
        @ApiResponse(responseCode = "404", description = "Article non trouvé", content = @Content)
    })
    @SecurityRequirement(name = "bearerAuth")
    @GetMapping("")
    public ResponseEntity<List<CommentResponse>> getComments(@PathVariable Long id) {
        List<Comment> comments = commentService.getByArticleId(id);
        List<CommentResponse> response = comments.stream()
            .map(commentResponseMapper::toCommentResponse)
            .toList();

        return ResponseEntity.ok(response);
    }

    /**
     * Ajoute un commentaire à l'article donné, avec l'utilisateur connecté comme auteur.
     *
     * @param id identifiant de l'article commenté
     * @param request données de création du commentaire (contenu)
     * @param authenticatedUser utilisateur actuellement authentifié, utilisé comme auteur
     * @return 201 avec le commentaire créé
     */
    @Operation(summary = "Ajout d'un commentaire à un article", description = "Ajoute un commentaire à l'article donné, avec l'utilisateur connecté comme auteur")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "201", description = "Commentaire créé"),
        @ApiResponse(responseCode = "400", description = "Requête invalide", content = @Content),
        @ApiResponse(responseCode = "401", description = "Utilisateur non authentifié", content = @Content),
        @ApiResponse(responseCode = "404", description = "Article non trouvé", content = @Content)
    })
    @SecurityRequirement(name = "bearerAuth")
    @PostMapping("")
    public ResponseEntity<CommentCreatedResponse> createComment(
        @PathVariable Long id,
        @Valid @RequestBody CreateCommentRequest request,
        @AuthenticationPrincipal UserDetailsImpl authenticatedUser
    ) {
        Comment comment = commentService.create(id, authenticatedUser.getId(), request.content());

        return ResponseEntity.status(HttpStatus.CREATED).body(commentResponseMapper.toCommentCreatedResponse(comment));
    }
}
